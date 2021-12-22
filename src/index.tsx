import React from 'react'
import PickerViewUI, { IPickerViewPrivateProps } from './picker-view'
import { Item } from './List'
import { findItem, hasVal } from './util'
import './index.less'

interface IProps extends IPickerViewPrivateProps {
  onListScroll?: Function
  onClose: Function
  onCancel?: Function
  onChange?: Function
}

export default class PickerView extends React.Component<IProps> {
  // 选中项的value的数组
  values: any[]

  // 选中项item的数组
  results: Item[]

  constructor(props: IProps) {
    super(props)
    const { defaultValue, options } = props
    /**
     * 初始化 values 和 results,
     * defaultValue 默认选中的项的值列表, 若不是数组 设为默认选中每列第一项
     */
    const initValue = Array.isArray(defaultValue) ? defaultValue : []
    this.values = options.map((item, i) => {
      if (hasVal(initValue[i], options[i])) {
        return initValue[i]
      }
      return item[0]?.value
    })
    /**
     * 初始化results 根据 options 的长度设置results的长度,
     * options 是一个2维数组, 其每个数组元素对应一列, 每一列的选中项对应results相对位置的元素
     * 因此results的长度与 options 的长度一致
     * 然后根据 defaultValue 的值从options中查询对应项填充到 results 中, 差不多的项填充为 null
     */
    this.results = new Array(options.length).fill(null).map((v, i) => {
      if (Array.isArray(options[i])) {
        return findItem(this.values[i], options[i])
      }
      return null
    })
  }

  handleOk = () => {
    const { onChange, onClose } = this.props
    onChange?.(this.values, this.results)
    onClose?.()
  }

  handleCancel = () => {
    const { onClose, onCancel } = this.props
    onCancel?.()
    onClose?.()
  }

  handleChange = (values: any[], results: Item[]) => {
    this.values = values
    this.results = results
    const { onListScroll } = this.props
    onListScroll?.(values, results)
  }

  render() {
    const { onChange, onCancel, onListScroll, ...props } = this.props
    return (
      <PickerViewUI
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        onChange={this.handleChange}
        {...props}
      />
    )
  }
}
