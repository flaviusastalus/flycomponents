import PropTypes from 'prop-types';
import React, { Component } from 'react';
import PrefixSelector from './PrefixSelector';

import FormGroup from '../FormGroup';

const NO_VALUE = '';

class PhoneNumber extends Component {
  static propTypes = {
    countries: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    floatingLabel: PropTypes.bool,
    hint: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    value: PropTypes.string
  };

  static defaultProps = {
    countries: [],
    disabled: false,
    floatingLabel: true,
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    readOnly: false
  };

  constructor(props) {
    super(props);
    this.numberInputRef = React.createRef();

    const { value: currentNumber = NO_VALUE } = this.props;
    const prefix = this.getCountryFrom(currentNumber);

    this.state = {
      prefix,
      formattedNumber: this.getWithoutPrefix(currentNumber, prefix),
      phoneNumber: currentNumber,
      isFocused: false
    };
  }

  getFormatNumber(value) {
    return value.replace(/[^\d]/g, NO_VALUE);
  }

  getWithoutPrefix(value, prefix = NO_VALUE) {
    const withoutPrefix = value.replace(prefix, NO_VALUE);

    return this.getFormatNumber(withoutPrefix);
  }

  getCountryFrom(value) {
    if (value === NO_VALUE) return NO_VALUE;
    const { countries } = this.props;
    const phoneNumber = this.getFormatNumber(value);

    const compareDialingCodeCountries = (country1, country2) => {
      const {
        dialingCode: { length: dialingCode1length } = { length: 0 }
      } = country1;
      const {
        dialingCode: { length: dialingCode2length } = { length: 0 }
      } = country2;
      if (dialingCode1length > dialingCode2length) return -1;
      if (dialingCode2length < dialingCode1length) return 1;

      return 0;
    };

    const selectedCountries = countries
      .filter(country => phoneNumber.startsWith(country.dialingCode))
      .sort(compareDialingCodeCountries);

    return selectedCountries.length === 0
      ? NO_VALUE
      : selectedCountries[0].dialingCode;
  }

  handleBlur = () => {
    const { name, onBlur } = this.props;

    this.setState({ isFocused: false });
    onBlur(name);
  };

  handleChange = e => {
    const { value: currentNumber } = e.target;
    const { prefix } = this.state;

    const formattedNumber = this.getFormatNumber(currentNumber);
    const phoneNumber = prefix
      ? `+${prefix} ${formattedNumber}`
      : formattedNumber;

    this.setState({ formattedNumber, phoneNumber, prefix }, () => {
      this.sendChange(phoneNumber);
    });
  };

  handlePrefixClick = prefix => {
    const { formattedNumber } = this.state;

    const phoneNumber = `+${prefix} ${formattedNumber}`;

    this.setState({ prefix }, () => {
      this.sendChange(phoneNumber);
    });
  };

  handleFocus = () => {
    const { name, onFocus } = this.props;

    this.setState({ isFocused: true });
    onFocus(name);
  };

  sendChange(value) {
    const { name, onChange } = this.props;

    onChange(name, value);
  }

  render() {
    const {
      countries,
      disabled,
      error,
      floatingLabel,
      hint,
      label,
      name,
      onBlur,
      onChange,
      onFocus,
      readOnly,
      required,
      value,
      ...otherProps
    } = this.props;

    const { formattedNumber, isFocused, prefix } = this.state;

    return (
      <div className="PhoneNumber" {...otherProps}>
        <FormGroup
          className="PhoneNumber"
          disabled={disabled}
          error={error}
          floatingLabel={floatingLabel}
          hint={hint}
          isFocused={isFocused}
          label={label}
          name={name}
          readOnly={readOnly}
          required={required}
          hasValue={!!value}
        >
          <div className="PhoneNumber-field">
            <PrefixSelector
              disabled={disabled}
              name={name}
              onChange={(name, value) => this.handlePrefixClick(value)}
              onFocus={onFocus}
              options={countries}
              readOnly={readOnly}
              value={prefix}
            />
            <div className="PhoneNumber-input">
              <input
                autoComplete="off"
                className="Input PhoneNumber-input-inner"
                disabled={disabled}
                id={name}
                name={name}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                ref={this.numberInputRef}
                readOnly={readOnly}
                type="text"
                value={formattedNumber}
              />
            </div>
          </div>
        </FormGroup>
      </div>
    );
  }
}

export default PhoneNumber;
