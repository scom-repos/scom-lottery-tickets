import { Module, customModule, Container, VStack } from '@ijstech/components';
import ScomStaking from '@scom/scom-lottery-tickets';

@customModule
export default class Module1 extends Module {
    private stakingElm: ScomStaking;
    private mainStack: VStack;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    async init() {
        super.init();
    }

    render() {
        return <i-panel>
            <i-hstack id="mainStack" margin={{ top: '1rem', left: '1rem' }} gap="2rem">
                <i-scom-lottery-tickets
                    networks={[
                        {
                            "chainId": 43113
                        },
                        {
                            "chainId": 97
                        }
                    ]}
                    wallets={[
                        {
                            "name": "metamask"
                        }
                    ]}
                    defaultChainId={43113}
                />
            </i-hstack>
        </i-panel>
    }
}