import React, { useState, useEffect, useMemo } from 'react'
import classnames from 'classnames'
import { Popup } from 'antd-mobile'
import { PopupProps } from 'antd-mobile/es/components/popup'
import List, { Item, IListPraviteProps } from './List'
import { PREFIX_CLS } from './util'

export interface IPickerViewPrivateProps {
  title?: any
  options: Item[][]
  value?: any[]
  defaultValue?: any[]
  okText?: string
  visible: boolean
  cancelText?: string
  // 是否展示选中项的上下边框
  showLine?: boolean
  // 相邻列中的分隔符
  separate?: string[]
  // antd-mobile 的popup属性
  popupProps?: PopupProps
}

interface IProps extends IPickerViewPrivateProps, IListPraviteProps {
  onCancel?: Function
  onOk?: Function
  onChange?: Function
}

function indexOf(val: any, arr: Item[], def = 0) {
  let index = def
  arr.some((item, i) => {
    if (item.value === val) {
      index = i
      return true
    }
    return false
  })
  return index
}

const PickerViewUI = ({
  prefix = PREFIX_CLS,
  title = '请选择',
  options,
  defaultValue,
  value,
  onChange,
  visible,
  onCancel,
  onOk,
  okText = '确定',
  cancelText = '取消',
  showLine = true,
  separate,
  popupProps = {}
}: IProps) => {
  const defValue = value || defaultValue
  const newValues = Array.isArray(defValue) ? defValue : [defValue]
  const curValues = options.map((option, i) => {
    const curValue = newValues[i]
    return indexOf(curValue, option, -1) >= 0 ? curValue : option[0].value
  })
  const [values, setValues] = useState(curValues)

  // 如果传入的数据有变化, 检查result在新数据里是否有效, 将无效数据替换成有效数据
  useEffect(() => {
    setValues(
      options.map((option, i) => {
        return indexOf(values[i], option, -1) >= 0 ? values[i] : option[0].value
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...options])

  // 同步value变化, 让组件可控
  useEffect(() => {
    // 如果新value有值, 判断新的value值是否有效, 如果无效使用对应option的第一个值替换
    if (value !== undefined) {
      const nvs = Array.isArray(value) ? value : [value]
      setValues(
        options.map((option, i) => (indexOf(nvs[i], option, -1) >= 0 ? nvs[i] : option[0].value))
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleCancel = () => {
    onCancel?.()
    // 取消的时候还原原来的值
    if (value === undefined) {
      setValues(curValues)
    }
  }

  const handleOk = () => {
    onOk?.()
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const result = useMemo(() => values.map((v, i) => indexOf(v, options[i])), [values])
  const handleListChange = (index: number, i: number) => {
    const newValues = [...values]
    const selected = options[i][index]
    newValues[i] = selected ? selected.value : options[i][0].value
    setValues(newValues)
    onChange?.(
      [...newValues],
      newValues.map((v, i) => {
        const curArr = options[i]
        for (let len = curArr.length, k = 0; k < len; k++) {
          if (curArr[k].value === v) {
            return curArr[k]
          }
        }
        return null
      })
    )
  }

  return (
    <Popup
      {...popupProps}
      className={classnames(prefix, popupProps.className)}
      visible={visible}
      afterClose={handleCancel}
      onMaskClick={handleCancel}
    >
      <div className={`${prefix}-header`}>
        <div className={classnames(`${prefix}-header-btn`, 'cancel')} onClick={handleCancel}>
          {cancelText}
        </div>
        <div className={`${prefix}-header-title`}>{title}</div>
        <div className={classnames(`${prefix}-header-btn`, 'ok')} onClick={handleOk}>
          {okText}
        </div>
      </div>
      <div className={`${prefix}-body`}>
        <div className={`${prefix}-content`}>
          {options.map((list, i) =>
            Array.isArray(list) && list.length ? (
              <List
                current={result[i]}
                onChange={(index: number) => handleListChange(index, i)}
                list={list}
                key={`list-wrap-${i}`}
              />
            ) : null
          )}
        </div>
        <div className={`${prefix}-mask`}>
          <div className={`${prefix}-mask-top`} />
          <div className={classnames(`${prefix}-mask-middle`, { 'show-line': showLine })}>
            <p className={`${prefix}-sep-wrap`}>
              {separate?.map((sep, index) => (
                <span
                  key={`${sep}-${index}`}
                  className={`${prefix}-sep`}
                  style={{ left: `${((index + 1) / options.length) * 100}%` }}
                >
                  {sep}
                </span>
              ))}
            </p>
          </div>
          <div className={`${prefix}-mask-bottom`} />
        </div>
      </div>
    </Popup>
  )
}

export default PickerViewUI
