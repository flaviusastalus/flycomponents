import PropTypes from 'prop-types'
import React, { Component } from 'react'
import InputGroup from '../InputGroup'
import Textarea from '../Textarea'
import Input from '../Input'

class TextInput extends Component {
  constructor(props) {
    super(props)

    this.state = { value: props.value }
  }

  handleBlur = e => {
    const { onBlur } = this.props
    const { name } = e.target

    onBlur(name)
  }

  handleChange = e => {
    const { onChange } = this.props
    let { name, value } = e.target

    onChange(name, value)
    this.setState({ value })
  }

  render() {
    const { value } = this.state
    const { multiline, prefix, sufix, ...inputAttrs } = this.props

    if (multiline) {
      return (
        <Textarea
          {...inputAttrs}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          value={value}
        />
      )
    } else {
      const Tag = sufix || prefix ? InputGroup : Input
      return (
        <Tag
          {...inputAttrs}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          prefix={prefix}
          sufix={sufix}
          type="text"
          value={value}
        />
      )
    }
  }
}

const { bool, func, string } = PropTypes

TextInput.propTypes = {
  multiline: bool,
  name: string.isRequired,
  onBlur: func,
  onChange: func,
  prefix: string,
  sufix: string,
  value: string
}

TextInput.defaultProps = {
  multiline: false,
  onBlur: () => {},
  onChange: () => {}
}
export default TextInput
