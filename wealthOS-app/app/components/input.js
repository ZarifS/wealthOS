import React, { Component } from 'react';
import { Icon, Input as KittenInput } from 'react-native-ui-kitten';

export default class Input extends Component {
  renderIcon = (style) => {
    return <Icon {...style} name={this.props.iconName} />;
  };

  render() {
    return (
      <KittenInput
        value={this.props.value}
        placeholder={this.props.placeholder}
        icon={this.props.renderIconFunction ? this.props.renderIconFunction : this.renderIcon}
        onChangeText={(val) => this.props.onChange(this.props.name, val)}
        onIconPress={this.props.onIconPress}
        secureTextEntry={this.props.secureTextEntry}
      />
    );
  }
}
