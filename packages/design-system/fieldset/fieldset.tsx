import {
  MutableRefObject,
  ComponentType,
  forwardRef,
  isValidElement,
} from "react";
import { Platform, StyleProp, ViewStyle } from "react-native";

import { AnimateHeight } from "@showtime-xyz/universal.accordion";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useId } from "@showtime-xyz/universal.input";
import { Label } from "@showtime-xyz/universal.label";
import { Select } from "@showtime-xyz/universal.select";
import type { SelectProps } from "@showtime-xyz/universal.select";
import { Switch } from "@showtime-xyz/universal.switch";
import type { SwitchProps } from "@showtime-xyz/universal.switch";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { TextInput } from "@showtime-xyz/universal.text-input";
import type { TextInputProps } from "@showtime-xyz/universal.text-input";
import { View } from "@showtime-xyz/universal.view";

export type FieldsetProps = {
  errorText?: any;
  label?: string | JSX.Element;
  helperText?: string | JSX.Element;
  helperTextTw?: string;
  disabled?: boolean;
  tw?: string;
  select?: SelectProps;
  switchProps?: SwitchProps;
  selectOnly?: boolean;
  switchOnly?: boolean;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  Component?: ComponentType;
  required?: boolean;
  componentRef?: MutableRefObject<ComponentType | undefined>;
  containerStyle?: StyleProp<ViewStyle>;
} & TextInputProps;

function FieldsetImpl(props: FieldsetProps, ref: any) {
  const {
    errorText,
    helperText,
    helperTextTw = "",
    label,
    disabled,
    select,
    switchProps,
    tw: twProp = "",
    leftElement,
    rightElement,
    selectOnly,
    switchOnly,
    required,
    Component = TextInput,
    containerStyle,
    ...textInputProps
  } = props;
  const isDark = useIsDarkMode();
  const inputId = useId();
  const helperTextId = useId();
  const errorTextId = useId();

  return (
    <View
      tw={[
        "rounded-2xl bg-gray-100 p-4 dark:bg-gray-900",
        disabled ? "opacity-40" : "",
        switchOnly ? "flex-1 flex-row items-center justify-between" : "",
        twProp,
      ]}
      style={containerStyle}
    >
      {label ? (
        <View tw="flex-row">
          {isValidElement(label) ? (
            label
          ) : (
            <Label
              htmlFor={inputId}
              tw="font-bold text-gray-900 dark:text-white"
            >
              {label}
            </Label>
          )}

          {required ? <Text tw="ml-1 text-red-500">*</Text> : null}
        </View>
      ) : null}

      <View tw="ml-auto">
        {switchProps ? <Switch {...switchProps} /> : null}
      </View>
      {!switchProps ? (
        <View tw={["flex-row items-center", label ? "mt-4" : ""]}>
          {leftElement}
          {!selectOnly ? (
            <Component
              tw="flex-1 text-black outline-none focus-visible:ring-1 dark:text-white"
              style={[{ fontSize: 16 }]}
              ref={ref}
              id={inputId}
              multiline={textInputProps.multiline}
              numberOfLines={textInputProps.numberOfLines ?? 1}
              blurOnSubmit={textInputProps.blurOnSubmit}
              textAlignVertical="top"
              placeholderTextColor={
                isDark ? colors.gray[400] : colors.gray[600]
              }
              selectionColor={isDark ? colors.gray[300] : colors.gray[700]}
              aria-describedby={Platform.select({
                web: helperText ? helperTextId : undefined,
                default: undefined,
              })}
              aria-errormessage={Platform.select({
                web: errorText ? errorTextId : undefined,
                default: undefined,
              })}
              aria-required={true}
              aria-invalid={Platform.select({
                web: errorText ? true : false,
                default: undefined,
              })}
              // @ts-ignore
              readOnly={disabled}
              {...textInputProps}
            />
          ) : null}

          {select ? (
            <Select disabled={disabled} size="small" {...select} />
          ) : null}
          {rightElement}
        </View>
      ) : null}

      <AnimateHeight>
        {errorText ? <ErrorText id={errorTextId}>{errorText}</ErrorText> : null}
      </AnimateHeight>
      <AnimateHeight
        extraHeight={Platform.select({
          ios: 0,
          default: 4,
        })}
      >
        {helperText ? (
          <>
            <View tw="mt-4 h-[1px] w-full bg-gray-200 dark:bg-gray-800" />
            <View tw="h-4" />
            <Text
              id={helperTextId}
              tw={[
                "text-sm leading-6 text-gray-700 dark:text-gray-300",
                helperTextTw,
              ]}
            >
              {helperText}
            </Text>
          </>
        ) : null}
      </AnimateHeight>
    </View>
  );
}

export const ErrorText = ({ children, id }: { children: any; id?: string }) => {
  return (
    <>
      <View tw="h-4" />
      <Text
        id={id}
        style={{ fontSize: 14 }}
        tw="font-semibold leading-6 text-red-500"
      >
        {children}
      </Text>
    </>
  );
};

export const Fieldset = forwardRef(FieldsetImpl);
