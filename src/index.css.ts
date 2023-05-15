import { Styles } from '@ijstech/components';
import Assets from './assets';
const Theme = Styles.Theme.ThemeVars;

const colorVar = {
  primaryButton: 'transparent linear-gradient(90deg, #AC1D78 0%, #E04862 100%) 0% 0% no-repeat padding-box',
  primaryGradient: 'linear-gradient(255deg,#f15e61,#b52082)',
  darkBg: '#181E3E 0% 0% no-repeat padding-box',
  primaryDisabled: 'transparent linear-gradient(270deg,#351f52,#552a42) 0% 0% no-repeat padding-box !important'
}

Styles.fontFace({
  fontFamily: "Apple SD Gothic Neo",
  src: `url("${Assets.fullPath('fonts/FontsFree-Net-Apple-SD-Gothic-Neo-Bold.ttf')}") format("truetype")`,
  fontWeight: 'bold',
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Montserrat Regular",
  src: `url("${Assets.fullPath('fonts/montserrat/Montserrat-Regular.ttf')}") format("truetype")`,
  fontWeight: 'nomal',
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Montserrat Bold",
  src: `url("${Assets.fullPath('fonts/montserrat/Montserrat-Bold.ttf')}") format("truetype")`,
  fontWeight: 'bold',
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Montserrat Light",
  src: `url("${Assets.fullPath('fonts/montserrat/Montserrat-Light.ttf')}") format("truetype")`,
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Montserrat Medium",
  src: `url("${Assets.fullPath('fonts/montserrat/Montserrat-Medium.ttf')}") format("truetype")`,
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Montserrat SemiBold",
  src: `url("${Assets.fullPath('fonts/montserrat/Montserrat-SemiBold.ttf')}") format("truetype")`,
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Raleway Regular",
  src: `url("${Assets.fullPath('fonts/raleway/Raleway-Regular.ttf')}") format("truetype")`,
  fontWeight: 'nomal',
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Raleway Bold",
  src: `url("${Assets.fullPath('fonts/raleway/Raleway-Bold.ttf')}") format("truetype")`,
  fontWeight: 'bold',
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Raleway Light",
  src: `url("${Assets.fullPath('fonts/raleway/Raleway-Light.ttf')}") format("truetype")`,
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Raleway Medium",
  src: `url("${Assets.fullPath('fonts/raleway/Raleway-Medium.ttf')}") format("truetype")`,
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Raleway SemiBold",
  src: `url("${Assets.fullPath('fonts/raleway/Raleway-SemiBold.ttf')}") format("truetype")`,
  fontStyle: 'normal'
})

export const lotteryTicketsComponent = Styles.style({
  background: Theme.background.main,
  $nest: {
    'i-label': {
      fontFamily: 'Montserrat Regular',
    },
    'span': {
      letterSpacing: '0.15px',
    },
    '.i-loading-overlay': {
      background: '#0c1234',
    },
    '.overflow-inherit': {
      overflow: 'inherit',
    },
    '::selection': {
      color: '#fff',
      background: '#1890ff'
    },
    '.btn-os': {
      background: colorVar.primaryButton,
      height: 'auto !important',
      color: '#fff',
      transition: 'background .3s ease',
      fontSize: '1rem',
      fontWeight: 'bold',
      fontFamily: 'Raleway Bold',
      $nest: {
        'i-icon.loading-icon': {
          marginInline: '0.25rem',
          width: '16px !important',
          height: '16px !important',
        },
      },
    },
    '.btn-os:not(.disabled):not(.is-spinning):hover, .btn-os:not(.disabled):not(.is-spinning):focus': {
      background: colorVar.primaryGradient,
      backgroundColor: 'transparent',
      boxShadow: 'none',
      opacity: .9
    },
    '.btn-os:not(.disabled):not(.is-spinning):focus': {
      boxShadow: '0 0 0 0.2rem rgb(0 123 255 / 25%)'
    },
    '.btn-os.disabled, .btn-os.is-spinning': {
      background: colorVar.primaryDisabled,
      opacity: 1
    },
    '.dark-bg, .dark-modal > div > div': {
      background: colorVar.darkBg,
      borderRadius: 5
    },
    '.btn-transparent, .btn-transparent:not(.disabled):focus, .btn-transparent:not(.disabled):hover': {
      background: 'transparent',
      boxShadow: 'none',
      backgroundColor: 'transparent'
    },
    '.hidden': {
      display: 'none !important'
    },
    '.no-wrap': {
      whiteSpace: 'nowrap'
    },
    '.flex-nowrap': {
      flexWrap: 'nowrap',
    },
    '.align-middle': {
      alignItems: 'center'
    },
    '.lottery-layout': {
      width: '100%',
      marginInline: 'auto',
      overflow: 'hidden'
    },
    'i-input input': {
      background: 'transparent',
      border: 'none',
      color: Theme.text.primary,
      textAlign: 'right',
      fontSize: '1.5rem'
    },
    '.text-overflow': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '.input-disabled': {
      opacity: 0.4,
      cursor: 'default',
      $nest: {
        '*': {
          cursor: 'default',
        }
      }
    },
    '#importFileErrModal': {
      $nest: {
        '.modal': {
          borderRadius: 12,
        },
        '.i-modal_header': {
          marginBottom: '1.5rem',
          paddingBottom: '0.5rem',
          borderBottom: `2px solid #F15E61`,
          color: '#F15E61',
          fontSize: '1.25rem',
          fontWeight: 700,
        },
        '.i-modal_header > i-icon': {
          fill: `#F15E61 !important`
        },
        '#importFileErr span': {
          fontSize: '16px !important'
        }
      }
    },
    'i-modal .modal': {
      background: '#192046',
    },
    '#loadingElm.i-loading--active': {
      marginTop: '2rem',
      position: 'initial',
      $nest: {
        '#lotteryElm': {
          display: 'none !important',
        },
        '.i-loading-spinner': {
          marginTop: '2rem',
        },
      },
    },
    '.connect-wallet': {
      display: 'block',
      textAlign: 'center',
      paddingTop: '1rem',
    },
  }
})
