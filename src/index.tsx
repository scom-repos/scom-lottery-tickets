import { Module, Panel, Button, Label, VStack, Container, ControlElement, IEventBus, application, customModule, Input, customElements, IDataSchema, Styles } from '@ijstech/components';
import Assets from './assets';
import {
	formatNumber,
	EventId,
	ILotteryTickets,
	INetworkConfig,
	ITokenObject,
} from './global/index';
import { isWalletConnected, setDataFromConfig } from './store/index';
import { tokenStore } from '@scom/scom-token-list';
import ScomWalletModal, { IWalletPlugin } from '@scom/scom-wallet-modal';
import configData from './data.json';

import { Result } from './common/index';
import { lotteryTicketsComponent } from './index.css';
import LotteryTicketsConfig from './commissions/index';
import ScomDappContainer from '@scom/scom-dapp-container';
import assets from './assets';
import { BigNumber } from '@ijstech/eth-contract';

const Theme = Styles.Theme.ThemeVars;

interface ScomLotteryTicketsElement extends ControlElement {
	tokens?: ITokenObject[];
	defaultChainId: number;
	networks: INetworkConfig[];
	wallets: IWalletPlugin[];
	showHeader?: boolean;
}

declare global {
	namespace JSX {
		interface IntrinsicElements {
			['i-scom-lottery-tickets']: ScomLotteryTicketsElement;
		}
	}
}

@customModule
@customElements('i-scom-lottery-tickets')
export default class ScomLotteryTickets extends Module {
	private _data: ILotteryTickets = {
		defaultChainId: 0,
		wallets: [],
		networks: []
	};
	tag: any = {};
	defaultEdit: boolean = true;
	readonly onEdit: () => Promise<void>;
	readonly onConfirm: () => Promise<void>;
	readonly onDiscard: () => Promise<void>;

	private $eventBus: IEventBus;
	private loadingElm: Panel;
	private lotteryElm: VStack;
	private lotteryTickets: Panel;
	private lotteryTicketsResult: Result;
	private configDApp: LotteryTicketsConfig;
	private dappContainer: ScomDappContainer;
	private mdWallet: ScomWalletModal;


	private inputTicket: Input;
	private lbBalance: Label;
	private lbValue: Label;
	private lbCostTitle: Label;
	private lbCostValue: Label;
	private lbPercent: Label;
	private lbDiscount: Label;
	private lbPay: Label;
	private btnBuy: Button;

	get defaultChainId() {
		return this._data.defaultChainId;
	}

	set defaultChainId(value: number) {
		this._data.defaultChainId = value;
	}

	get wallets() {
		return this._data.wallets ?? [];
	}
	set wallets(value: IWalletPlugin[]) {
		this._data.wallets = value;
	}

	get networks() {
		return this._data.networks ?? [];
	}
	set networks(value: INetworkConfig[]) {
		this._data.networks = value;
	}

	get showHeader() {
		return this._data.showHeader ?? true;
	}
	set showHeader(value: boolean) {
		this._data.showHeader = value;
	}

	private getActions() {
		const propertiesSchema: any = {
			type: "object",
			properties: {
				chainId: {
					type: "number",
					enum: [1, 56, 137, 250, 97, 80001, 43113, 43114],
				}
			}
		}

		const themeSchema: IDataSchema = {
			type: 'object',
			properties: {
				"dark": {
					type: 'object',
					properties: {
						backgroundColor: {
							type: 'string',
							format: 'color'
						},
						fontColor: {
							type: 'string',
							format: 'color'
						},
						inputBackgroundColor: {
							type: 'string',
							format: 'color'
						},
						inputFontColor: {
							type: 'string',
							format: 'color'
						}
					}
				},
				"light": {
					type: 'object',
					properties: {
						backgroundColor: {
							type: 'string',
							format: 'color'
						},
						fontColor: {
							type: 'string',
							format: 'color'
						},
						inputBackgroundColor: {
							type: 'string',
							format: 'color'
						},
						inputFontColor: {
							type: 'string',
							format: 'color'
						}
					}
				}
			}
		}

		return this._getActions(propertiesSchema, themeSchema);
	}

	private _getActions(propertiesSchema: IDataSchema, themeSchema: IDataSchema) {
		const actions = [
			{
				name: 'Settings',
				icon: 'cog',
				command: (builder: any, userInputData: any) => {
					let _oldData: ILotteryTickets = {
						chainId: 0,
						defaultChainId: 0,
						wallets: [],
						networks: []
					};
					return {
						execute: async () => {
							_oldData = { ...this._data };
							this.configDApp.data = this._data;
							this.onSetupPage(isWalletConnected());
							if (builder?.setData) builder.setData(this._data);
						},
						undo: async () => {
							this._data = { ..._oldData };
							this.configDApp.data = this._data;
							this.onSetupPage(isWalletConnected());
							if (builder?.setData) builder.setData(this._data);
						},
						redo: () => { }
					}
				},
				userInputDataSchema: propertiesSchema
			},
			{
				name: 'Theme Settings',
				icon: 'palette',
				command: (builder: any, userInputData: any) => {
					let oldTag = {};
					return {
						execute: async () => {
							if (!userInputData) return;
							oldTag = JSON.parse(JSON.stringify(this.tag));
							if (builder) builder.setTag(userInputData);
							else this.setTag(userInputData);
							if (this.dappContainer) this.dappContainer.setTag(userInputData);
						},
						undo: () => {
							if (!userInputData) return;
							this.tag = JSON.parse(JSON.stringify(oldTag));
							if (builder) builder.setTag(this.tag);
							else this.setTag(this.tag);
							if (this.dappContainer) this.dappContainer.setTag(userInputData);
						},
						redo: () => { }
					}
				},
				userInputDataSchema: themeSchema
			}
		]
		return actions;
	}

	getConfigurators() {
		let self = this;
		return [
			{
				name: 'Builder Configurator',
				target: 'Builders',
				getActions: this.getActions.bind(this),
				getData: this.getData.bind(this),
				setData: async (data: any) => {
					const defaultData = configData.defaultBuilderData;
					await this.setData({ ...defaultData, ...data });
					if (this.mdWallet) {
						this.mdWallet.networks = this._data.networks;
						this.mdWallet.wallets = this._data.wallets;
					}
				},
				getTag: this.getTag.bind(this),
				setTag: this.setTag.bind(this)
			},
			{
				name: 'Emdedder Configurator',
				target: 'Embedders',
				elementName: 'i-scom-lottery-tickets-config',
				getLinkParams: () => {
					const commissions = this._data.commissions || [];
					return {
						data: window.btoa(JSON.stringify(commissions))
					}
				},
				setLinkParams: async (params: any) => {
					if (params.data) {
						const decodedString = window.atob(params.data);
						const commissions = JSON.parse(decodedString);
						let resultingData = {
							...self._data,
							commissions
						};
						await this.setData(resultingData);
					}
				},
				bindOnChanged: (element: LotteryTicketsConfig, callback: (data: any) => Promise<void>) => {
					element.onCustomCommissionsChanged = async (data: any) => {
						let resultingData = {
							...self._data,
							...data
						};
						await this.setData(resultingData);
						await callback(data);
					}
				},
				getData: this.getData.bind(this),
				setData: this.setData.bind(this),
				getTag: this.getTag.bind(this),
				setTag: this.setTag.bind(this)
			}
		]
	}

	private async getData() {
		return this._data;
	}

	private async setData(value: ILotteryTickets) {
		this._data = value;
		this.configDApp.data = value;
		// TODO - update proxy address
		this.onSetupPage(isWalletConnected());
		if (this.mdWallet) {
			this.mdWallet.networks = value.networks;
			this.mdWallet.wallets = value.wallets;
		}
	}

	private async getTag() {
		return this.tag;
	}

	private async setTag(value: any) {
		const newValue = value || {};
		if (newValue.light) this.updateTag('light', newValue.light);
		if (newValue.dark) this.updateTag('dark', newValue.dark);
		if (this.dappContainer)
			this.dappContainer.setTag(this.tag);
		this.updateTheme();
	}

	private updateTag(type: 'light' | 'dark', value: any) {
		this.tag[type] = this.tag[type] ?? {};
		for (let prop in value) {
			if (value.hasOwnProperty(prop))
				this.tag[type][prop] = value[prop];
		}
	}

	private updateStyle(name: string, value: any) {
		value ?
			this.style.setProperty(name, value) :
			this.style.removeProperty(name);
	}

	private updateTheme() {
		const themeVar = this.dappContainer?.theme || 'light';
		this.updateStyle('--text-primary', this.tag[themeVar]?.fontColor);
		this.updateStyle('--background-main', this.tag[themeVar]?.backgroundColor);
		this.updateStyle('--input-font_color', this.tag[themeVar]?.inputFontColor);
		this.updateStyle('--input-background', this.tag[themeVar]?.inputBackgroundColor);
	}

	constructor(parent?: Container, options?: ControlElement) {
		super(parent, options);
		if (configData) setDataFromConfig(configData);
		this.$eventBus = application.EventBus;
		this.registerEvent();
	}

	private registerEvent = () => {
		this.$eventBus.register(this, EventId.IsWalletConnected, this.onWalletConnect);
		this.$eventBus.register(this, EventId.IsWalletDisconnected, this.onWalletConnect);
		this.$eventBus.register(this, EventId.chainChanged, this.onChainChange);
	}

	private onWalletConnect = async (connected: boolean) => {
		this.onSetupPage(connected);
	}

	private onChainChange = async () => {
		this.onSetupPage(isWalletConnected());
	}

	private onSetupPage = async (connected: boolean, hideLoading?: boolean) => {
		const data: ILotteryTickets = {
			defaultChainId: this.defaultChainId,
			wallets: this.wallets,
			networks: this.networks,
			showHeader: this.showHeader
		}
		if (this.dappContainer?.setData) this.dappContainer.setData(data);
		if (!hideLoading && this.loadingElm) {
			this.loadingElm.visible = true;
		}
		tokenStore.updateTokenMapData();
		this.updateLabels();
		this.updateBtnBuy();
		if (!hideLoading && this.loadingElm) {
			this.loadingElm.visible = false;
		}
	}

	private showResultMessage = (result: Result, status: 'warning' | 'success' | 'error', content?: string | Error) => {
		if (!result) return;
		let params: any = { status };
		if (status === 'success') {
			params.txtHash = content;
		} else {
			params.content = content;
		}
		result.message = { ...params };
		result.showModal();
	}

	private onBuyTickets = () => {
		if (!isWalletConnected()) {
			this.mdWallet.showModal();
			return;
		}
		// TODO
	}

	private onInputTickets = () => {
		const _input = this.inputTicket;
		let value = _input.value;
		value = value.replace(/[^0-9]+/g, '');
		this.inputTicket.value = value;
		this.updateLabels();
		this.updateBtnBuy();
	}

	private updateLabels = () => {
		const inputVal = Number(this.inputTicket.value);
		const val = !inputVal || isNaN(inputVal) ? 0 : inputVal;
		const discountPercent = val >= 100 ? 4.95 : val >= 50 ? 2.45 : val >= 2 ? 0.05 : 0;
		const discount = new BigNumber(val).multipliedBy(discountPercent).dividedBy(100);
		this.lbValue.caption = `~${formatNumber(val)} OSWAP`;
		this.lbCostValue.caption = `${formatNumber(val)} OSWAP`;
		this.lbPercent.caption = `${discountPercent}%`;
		this.lbDiscount.caption = `~${formatNumber(discount)} OSWAP`;
		this.lbPay.caption = `~${formatNumber(new BigNumber(val).minus(discount))} OSWAP`;
	}

	private updateBtnBuy = () => {
		if (!this.btnBuy) return;
		if (!isWalletConnected()) {
			this.btnBuy.enabled = true;
			this.btnBuy.rightIcon.visible = false;
			this.btnBuy.caption = 'Connect Wallet';
		} else {
			const inputVal = Number(this.inputTicket.value);
			this.btnBuy.enabled = !(!inputVal || isNaN(inputVal));
			this.btnBuy.caption = 'Buy Tickets';
		}
	}

	async init() {
		this.isReadyCallbackQueued = true;
		super.init();
		this.lotteryTicketsResult = new Result();
		this.lotteryTickets.appendChild(this.lotteryTicketsResult);
		this.lotteryTicketsResult.visible = false;
		this.showResultMessage(this.lotteryTicketsResult, 'warning', '');
		setTimeout(() => {
			this.lotteryTicketsResult.closeModal();
			this.lotteryTicketsResult.visible = true;
		}, 100);
		const commissions = this.getAttribute('commissions', true, []);
		const defaultChainId = this.getAttribute('defaultChainId', true);
		const chainId = this.getAttribute('chainId', true);
		const networks = this.getAttribute('networks', true);
		const tokens = this.getAttribute('tokens', true, []);
		const wallets = this.getAttribute('wallets', true);
		const showHeader = this.getAttribute('showHeader', true);
		await this.setData({ commissions, chainId, defaultChainId, networks, tokens, wallets, showHeader });
		this.updateBtnBuy();
		this.isReadyCallbackQueued = false;
		this.executeReadyCallback();
	}

	render() {
		return (
			<i-scom-dapp-container id="dappContainer">
				<i-panel id="lotteryTickets" padding={{ left: 10, right: 10 }} class={lotteryTicketsComponent} minHeight={300}>
					<i-panel margin={{ top: '1rem', bottom: '1rem', left: 'auto', right: 'auto' }}>
						<i-vstack id="loadingElm" class="i-loading-overlay">
							<i-vstack class="i-loading-spinner" horizontalAlignment="center" verticalAlignment="center">
								<i-icon
									class="i-loading-spinner_icon"
									image={{ url: Assets.fullPath('img/loading.svg'), width: 36, height: 36 }}
								/>
								<i-label
									caption="Loading..." font={{ color: '#FD4A4C', size: '1.5em' }}
									class="i-loading-spinner_text"
								/>
							</i-vstack>
						</i-vstack>
						<i-vstack id="lotteryElm" gap={20} border={{ radius: 16, width: 2, style: 'solid', color: Theme.background.modal }} overflow="hidden">
							<i-panel padding={{ top: 16, bottom: 16, left: 10, right: 10 }} background={{ color: Theme.background.modal }}>
								<i-label caption="Buy Tickets" font={{ size: '1.5rem', bold: true }} />
							</i-panel>
							<i-vstack gap={15} padding={{ left: 10, right: 10 }}>
								<i-hstack gap={10} verticalAlignment="center" horizontalAlignment="space-between">
									<i-label caption="Buy" font={{ bold: true, size: '1rem' }} opacity={0.7} />
									<i-hstack gap={4} verticalAlignment="center">
										<i-label caption="Tickets" font={{ bold: true, size: '1.125rem' }} />
										<i-image url={assets.fullPath('img/tickets.png')} width={16} height={16} />
									</i-hstack>
								</i-hstack>
								<i-hstack horizontalAlignment="end">
									<i-label id="lbBalance" caption="Balance: 0 OSWAP" opacity={0.7} />
								</i-hstack>
								<i-vstack gap={10} horizontalAlignment="end" background={{ color: Theme.input.background }} padding={{ top: 16, bottom: 16, left: 16, right: 16 }} border={{ radius: 16 }}>
									<i-input id="inputTicket" placeholder="0" inputType="number" width="100%" background={{ color: 'transparent' }} font={{ color: Theme.input.fontColor }} onChanged={this.onInputTickets} />
									<i-label id="lbValue" caption="~0.00 OSWAP" font={{ bold: true, size: '0.875rem' }} opacity={0.7} />
								</i-vstack>
								<i-hstack gap={10} verticalAlignment="center" horizontalAlignment="space-between">
									<i-label id="lbCostTitle" caption="Cost (OSWAP)" font={{ bold: true }} opacity={0.7} />
									<i-label id="lbCostValue" caption="0 OSWAP" font={{ bold: true }} opacity={0.7} />
								</i-hstack>
								<i-hstack gap={10} verticalAlignment="center" horizontalAlignment="space-between">
									<i-hstack gap={2} verticalAlignment="center">
										<i-label id="lbPercent" caption="0%" font={{ bold: true }} />
										<i-label caption="Bulk discount" font={{ bold: true }} opacity={0.7} />
										<i-icon
											name="question-circle"
											width={16}
											height={16}
											opacity={0.7}
											tooltip={{
												trigger: 'hover',
												content: 'Buying multiple tickets in a single transaction gives a discount. The discount increases in a linear way, up to the maximum of 100 tickets:<br>2 tickets: 0.05%<br>50 tickets: 2.45%<br>100 tickets: 4.95%'
											}}
										/>
									</i-hstack>
									<i-label id="lbDiscount" caption="~0 OSWAP" font={{ bold: true }} opacity={0.7} />
								</i-hstack>
								<i-panel width="100%" height={2} background={{ color: Theme.divider }} />
								<i-hstack gap={10} verticalAlignment="center" horizontalAlignment="space-between">
									<i-label caption="You Pay" font={{ bold: true, size: '1rem' }} opacity={0.7} />
									<i-label id="lbPay" caption="~0 OSWAP" font={{ bold: true, size: '1rem' }} />
								</i-hstack>
								<i-button
									id="btnBuy"
									caption="Buy Tickets"
									minHeight={48}
									margin={{ top: 10, bottom: 20 }}
									class="btn-os"
									rightIcon={{ spin: true, visible: false }}
									onClick={this.onBuyTickets}
								/>
							</i-vstack>
						</i-vstack>
					</i-panel>
					<i-scom-lottery-tickets-config id="configDApp" visible={false} />
					<i-scom-wallet-modal id="mdWallet" wallets={[]} />
				</i-panel>
			</i-scom-dapp-container>
		)
	}
}
