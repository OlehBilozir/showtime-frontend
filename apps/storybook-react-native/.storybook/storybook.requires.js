/* do not change this file, it is auto generated by storybook. */

import {
  configure,
  addDecorator,
  addParameters,
  addArgsEnhancer,
} from "@storybook/react-native";

import "@storybook/addon-ondevice-notes/register";
import "@storybook/addon-ondevice-controls/register";
import "@storybook/addon-ondevice-backgrounds/register";
import "@storybook/addon-ondevice-actions/register";

import { argsEnhancers } from "@storybook/addon-actions/dist/modern/preset/addArgs";

import { decorators, parameters } from "./preview";

if (decorators) {
  decorators.forEach((decorator) => addDecorator(decorator));
}

if (parameters) {
  addParameters(parameters);
}

argsEnhancers.forEach((enhancer) => addArgsEnhancer(enhancer));

const getStories = () => {
  return [
    require("../../../packages/design-system/pressable-scale/pressable-scale.stories.tsx"),
    require("../../../packages/design-system/text/text.stories.tsx"),
  ];
};

configure(getStories, module, false);
