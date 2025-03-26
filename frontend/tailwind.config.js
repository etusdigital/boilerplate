const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

const borderColor = {
  neutral: {
    default: "var(--neutral-border-default)",
    hover: "var(--neutral-border-hover)",
    pressed: "var(--neutral-border-pressed)",
    disabled: "var(--neutral-border-disabled)",
    selected: "var(--neutral-border-selected)",
  },
  primary: {
    default: "var(--primary-border-default)",
    hover: "var(--primary-border-hover)",
    pressed: "var(--primary-border-pressed)",
    selected: "var(--primary-border-selected)",
  },
  informative: {
    default: "var(--informative-border-default)",
    hover: "var(--informative-border-hover)",
    pressed: "var(--informative-border-pressed)",
    selected: "var(--informative-border-selected)",
  },
  success: {
    default: "var(--success-border-default)",
    hover: "var(--success-border-hover)",
    pressed: "var(--success-border-pressed)",
    selected: "var(--success-border-selected)",
  },
  warning: {
    default: "var(--warning-border-default)",
    hover: "var(--warning-border-hover)",
    pressed: "var(--warning-border-pressed)",
    selected: "var(--warning-border-selected)",
  },
  danger: {
    default: "var(--danger-border-default)",
    hover: "var(--danger-border-hover)",
    pressed: "var(--danger-border-pressed)",
    selected: "var(--danger-border-selected)",
  },
};
const borderWidth = {
  none: "var(--border-width-none)",
  xxs: "var(--border-width-xxs)",
  xs: "var(--border-width-xs)",
  sm: "var(--border-width-sm)",
  base: "var(--border-width-base)",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{vue,ts}"],
  theme: {
    extend: {
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0em",
        wide: "0.05em",
        wider: "0.070em",
        widest: "0.1em",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xxs: "var(--font-size-xxs)",
        xs: "var(--font-size-xs)",
        sm: "var(--font-size-sm)",
        base: "var(--font-size-base)",
        md: "var(--font-size-md)",
        lg: "var(--font-size-lg)",
        xl: "var(--font-size-xl)",
        "2xl": "var(--font-size-2xl)",
        "3xl": "var(--font-size-3xl)",
        "4xl": "var(--font-size-4xl)",
        "5xl": "var(--font-size-5xl)",
        "6xl": "var(--font-size-6xl)",
        "7xl": "var(--font-size-7xl)",
        "8xl": "var(--font-size-8xl)",
        "9xl": "var(--font-size-9xl)",
      },
      fontWeight: {
        thin: "var(--font-weight-thin)",
        extralight: "var(--font-weight-extra-light)",
        light: "var(--font-weight-light)",
        normal: "var(--font-weight-normal)",
        medium: "var(--font-weight-medium)",
        semibold: "var(--font-weight-semibold)",
        bold: "var(--font-weight-bold)",
        extrabold: "var(--font-weight-extra-bold)",
        black: "var(--font-weight-black)",
      },
      lineHeight: {
        none: "var(--line-height-none)",
        xxs: "var(--line-height-xxs)",
        xs: "var(--line-height-xs)",
        sm: "var(--line-height-sm)",
        base: "var(--line-height-base)",
        lg: "var(--line-height-lg)",
        xl: "var(--line-height-xl)",
      },
      spacing: {
        none: "var(--spacing-none)",
        "2xxs": "var(--spacing-2xxs)",
        xxs: "var(--spacing-xxs)",
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        base: "var(--spacing-base)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
        "2xl": "var(--spacing-2xl)",
        "3xl": "var(--spacing-3xl)",
        "4xl": "var(--spacing-4xl)",
        "5xl": "var(--spacing-5xl)",
        "6xl": "var(--spacing-6xl)",
        "7xl": "var(--spacing-7xl)",
        "8xl": "var(--spacing-8xl)",
        "9xl": "var(--spacing-9xl)",
        "10xl": "var(--spacing-10xl)",
        "11xl": "var(--spacing-11xl)",
        "12xl": "var(--spacing-12xl)",
        "13xl": "var(--spacing-13xl)",
        "14xl": "var(--spacing-14xl)",
        "15xl": "var(--spacing-15xl)",
        "16xl": "var(--spacing-16xl)",
        "17xl": "var(--spacing-17xl)",
        "18xl": "var(--spacing-18xl)",
        "19xl": "var(--spacing-19xl)",
        "20xl": "var(--spacing-20xl)",
      },
      borderWidth: borderWidth,
      outlineWidth: borderWidth,
      borderRadius: {
        none: "var(--border-radius-none)",
        xxs: "var(--border-radius-xxs)",
        xs: "var(--border-radius-xs)",
        sm: "var(--border-radius-sm)",
        base: "var(--border-radius-base)",
        lg: "var(--border-radius-lg)",
        xl: "var(--border-radius-xl)",
        "2xl": "var(--border-radius-2xl)",
        full: "var(--border-radius-full)",
      },
      colors: {
        default: "var(--neutral-background-default)",
        emphasis: "var(--neutral-background-emphasis)",
        negative: "var(--neutral-background-negative)",
        neutral: {
          surface: {
            default: "var(--neutral-surface-default)",
            highlight: "var(--neutral-surface-highlight)",
            hover: "var(--neutral-surface-hover)",
            disabled: "var(--neutral-surface-disabled)",
          },
          interaction: {
            default: "var(--neutral-interaction-default)",
            hover: "var(--neutral-interaction-hover)",
            pressed: "var(--neutral-interaction-pressed)",
            disabled: "var(--neutral-interaction-disabled)",
          },
          foreground: {
            disabled: "var(--neutral-foreground-disabled)",
            low: "var(--neutral-foreground-low)",
            high: "var(--neutral-foreground-high)",
            negative: "var(--neutral-foreground-negative)",
          },
        },
        primary: {
          surface: {
            default: "var(--primary-surface-default)",
            highlight: "var(--primary-surface-highlight)",
            hover: "var(--primary-surface-hover)",
            pressed: "var(--primary-surface-pressed)",
          },
          interaction: {
            default: "var(--primary-interaction-default)",
            hover: "var(--primary-interaction-hover)",
            pressed: "var(--primary-interaction-pressed)",
            selected: "var(--primary-interaction-selected)",
          },
          foreground: {
            disabled: "var(--primary-foreground-disabled)",
            low: "var(--primary-foreground-low)",
            high: "var(--primary-foreground-high)",
          },
        },
        secondary: {
          interaction: {
            default: "var(--secondary-interaction-default)",
          },
        },
        informative: {
          surface: {
            default: "var(--informative-surface-default)",
            highlight: "var(--informative-surface-highlight)",
            hover: "var(--informative-surface-hover)",
            pressed: "var(--informative-surface-pressed)",
          },
          interaction: {
            default: "var(--informative-interaction-default)",
            hover: "var(--informative-interaction-hover)",
            pressed: "var(--informative-interaction-pressed)",
            selected: "var(--informative-interaction-selected)",
          },
          foreground: {
            disabled: "var(--informative-foreground-disabled)",
            low: "var(--informative-foreground-low)",
            high: "var(--informative-foreground-high)",
          },
        },
        success: {
          surface: {
            default: "var(--success-surface-default)",
            highlight: "var(--success-surface-highlight)",
            hover: "var(--success-surface-hover)",
            pressed: "var(--success-surface-pressed)",
          },
          interaction: {
            default: "var(--success-interaction-default)",
            hover: "var(--success-interaction-hover)",
            pressed: "var(--success-interaction-pressed)",
            selected: "var(--success-interaction-selected)",
          },
          foreground: {
            disabled: "var(--success-foreground-disabled)",
            low: "var(--success-foreground-low)",
            high: "var(--success-foreground-high)",
          },
        },
        warning: {
          surface: {
            default: "var(--warning-surface-default)",
            highlight: "var(--warning-surface-highlight)",
            hover: "var(--warning-surface-hover)",
            pressed: "var(--warning-surface-pressed)",
          },
          interaction: {
            default: "var(--warning-interaction-default)",
            hover: "var(--warning-interaction-hover)",
            pressed: "var(--warning-interaction-pressed)",
            selected: "var(--warning-interaction-selected)",
          },
          foreground: {
            disabled: "var(--warning-foreground-disabled)",
            low: "var(--warning-foreground-low)",
            high: "var(--warning-foreground-high)",
          },
        },
        danger: {
          surface: {
            default: "var(--danger-surface-default)",
            highlight: "var(--danger-surface-highlight)",
            hover: "var(--danger-surface-hover)",
            pressed: "var(--danger-surface-pressed)",
          },
          interaction: {
            default: "var(--danger-interaction-default)",
            hover: "var(--danger-interaction-hover)",
            pressed: "var(--danger-interaction-pressed)",
            selected: "var(--danger-interaction-selected)",
          },
          foreground: {
            disabled: "var(--danger-foreground-disabled)",
            low: "var(--danger-foreground-low)",
            high: "var(--danger-foreground-high)",
          },
        },
      },
      borderColor: borderColor,
      outlineColor: borderColor,
      boxShadow: {
        "neutral-default":
          "0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)",
        "neutral-selected": "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant, e, postcss, addComponents }) {
      addComponents({
        ".p1": {
          "@apply text-2xl font-normal leading-lg": {},
        },
        ".p2": {
          "@apply text-base font-normal leading-lg": {},
        },
        ".p3": {
          "@apply text-sm font-normal leading-lg": {},
        },
        ".p4": {
          "@apply text-xs font-normal leading-lg": {},
        },
        ".caption-c1": {
          "@apply text-xs font-medium": {},
        },
        ".caption-c2": {
          "@apply text-xxs font-normal": {},
        },
      });
      addVariant("firefox", ({ container, separator }) => {
        const isFirefoxRule = postcss.atRule({
          name: "-moz-document",
          params: "url-prefix()",
        });
        isFirefoxRule.append(container.nodes);
        container.append(isFirefoxRule);
        isFirefoxRule.walkRules((rule) => {
          rule.selector = `.${e(
            `firefox${separator}${rule.selector.slice(1)}`
          )}`;
        });
      });
    }),
  ],
};