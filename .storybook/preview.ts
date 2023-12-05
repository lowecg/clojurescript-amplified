
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
    backgrounds: {default: "light"},
    docs: {
      inlineStories: false,  // A (temporary?) workaround for dependency conflicts in Storybook and MUI5.
    }
  },
};
export default preview;