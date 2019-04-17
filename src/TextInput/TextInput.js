import PropTypes from 'prop-types';
import React, { Component } from 'react';
import InputGroup from '../InputGroup';
import Textarea from '../Textarea';
import Input from '../Input';
import FormGroup from '../FormGroup';
import { applyPattern } from '../utils/formatter';

class TextInput extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    error: PropTypes.string,
    floatingLabel: PropTypes.bool,
    format: PropTypes.shape({
      pattern: PropTypes.string,
      options: PropTypes.object
    }),
    hint: PropTypes.string,
    label: PropTypes.string,
    multiline: PropTypes.bool,
    name: PropTypes.string.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    prefix: PropTypes.string,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    suffix: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string
  };

  static defaultProps = {
    disabled: false,
    floatingLabel: true,
    multiline: false,
    onBlur: () => {},
    onChange: () => {},
    readOnly: false,
    type: 'text',
    value: ''
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      hasValue: !!props.value,
      isFocused: false,
      caretPosition: 0
    };
  }

  fieldValue() {
    return this.state.value;
  }

  handleBlur = e => {
    const { onBlur } = this.props;
    const { name } = e.target;
    this.setState({ isFocused: false });

    onBlur(name);
  };

  getSeparatorsToPosition = (value, toPosition) => {
    return (value && value.substring(0, toPosition).match(/[^0-9]/g)) || [];
  };

  hasFormatChange = (lengthDiff, separatorsDiff) =>
    lengthDiff >= 0 && separatorsDiff !== 0;

  setCaretPosition = (currentPosition, currentValue, newValue) => {
    const { value } = this.state;
    if (
      currentValue.length < value.length &&
      value.length === newValue.length
    ) {
      currentPosition--;
    } else if (newValue.length > currentValue.length) {
      currentPosition++;
    }

    if (newValue.length > currentValue.length) {
      currentPosition++;
    }

    const currentSeparators = this.getSeparatorsToPosition(
      currentValue,
      currentPosition
    );

    const newSeparators = this.getSeparatorsToPosition(
      newValue,
      currentPosition
    );

    let lengthDiff = newValue.length - currentValue.length;
    let separatorsDiff = newSeparators.length - currentSeparators.length;

    const position = this.hasFormatChange(lengthDiff, separatorsDiff)
      ? currentPosition + (lengthDiff || 1)
      : currentPosition;

    return position;
  };

  handleChange = e => {
    const { onChange, format } = this.props;
    let { name, value: currentValue, selectionStart: caretPosition } = e.target;
    let value = currentValue;

    if (format) {
      const { pattern, options } = format;
      value = applyPattern(currentValue, pattern, options);
      caretPosition = this.setCaretPosition(caretPosition, currentValue, value);
    }

    onChange(name, value);
    this.setState({ value, hasValue: !!value, caretPosition });
  };

  handleFocus = e => {
    const { disabled, readOnly } = this.props;
    if (disabled || readOnly) return false;
    this.setState({ isFocused: true });
  };

  input() {
    const {
      floatingLabel,
      multiline,
      suffix,
      prefix,
      type,
      format,
      ...inputAttrs
    } = this.props;

    return (
      <Input
        {...inputAttrs}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        type={type}
        value={this.fieldValue()}
      />
    );
  }

  inputGroup() {
    const {
      floatingLabel,
      multiline,
      prefix,
      suffix,
      type,
      ...inputAttrs
    } = this.props;

    return (
      <InputGroup
        {...inputAttrs}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        prefix={prefix}
        suffix={suffix}
        type={type}
        value={this.fieldValue()}
      />
    );
  }

  textArea() {
    const {
      floatingLabel,
      multiline,
      prefix,
      suffix,
      ...inputAttrs
    } = this.props;

    return (
      <Textarea
        {...inputAttrs}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        value={this.fieldValue()}
      />
    );
  }

  renderElement() {
    const { multiline, prefix, suffix } = this.props;

    if (multiline) {
      return this.textArea();
    }

    if (suffix || prefix) {
      return this.inputGroup();
    } else {
      return this.input();
    }
  }

  render() {
    const {
      disabled,
      error,
      floatingLabel,
      hint,
      label,
      name,
      prefix,
      readOnly,
      required,
      suffix
    } = this.props;

    const { isFocused, hasValue } = this.state;

    return (
      <FormGroup
        className="TextInput"
        disabled={disabled}
        error={error}
        floatingLabel={floatingLabel}
        hasPrefix={!!prefix}
        hasSuffix={!!suffix}
        hasValue={hasValue}
        hint={hint}
        isFocused={isFocused}
        label={label}
        name={name}
        readOnly={readOnly}
        required={required}
      >
        {this.renderElement()}
      </FormGroup>
    );
  }
}

export default TextInput;
