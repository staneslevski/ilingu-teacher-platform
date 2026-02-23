import React, { Component } from "react";
import { FixedSizeList as List } from "react-window";
import momentTZ from "moment-timezone";

export const options = [];
momentTZ.tz.names().forEach(t => {
  options.push({
    value: t,
    label:t,
  })
});

const height = 35;

export class MenuList extends Component {
  render() {
    const { options, children, maxHeight, getValue } = this.props;
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * height;
    return (
      <List
        height={maxHeight}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
  }
}