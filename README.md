# 可自定义样式的 Picker 选择器

## 背景

由于 antd-mobile(v5.0.0-beta.19) 提供的 Picker 无法直接自定义样式（如选项高度、选中项字体加粗、选中项相邻项目缩放显示等），导致无法 100% 还原设计稿。故而基于 antd-mobile 的 Popup 组件，实现了一套自己的 PickerView。

## Props

| Name           | Type       | Necessary | Default       | Description                     |
| -------------- | ---------- | --------- | ------------- | ------------------------------- |
| title          | string     | 否        | "请选择"      | Picker 标题                     |
| prefix         | string     | 否        | "picker-view" | 类名前缀                        |
| options        | Item[][]   | 是        | -             | 选项数据源                      |
| listItemHeight | number     | 否        | 50            | 选项条目高度                    |
| listClass      | string     | 否        | ""            | 选项列自定义类名                |
| defaultValue   | any[]      | 否        | []            | 默认选中项                      |
| onChange       | Function   | 否        | -             | 数据变更回调                    |
| visible        | boolean    | 是        | false         | 控制弹层的显示/隐藏             |
| onClose        | Function   | 否        | -             | 关闭弹层的函数                  |
| onCancel       | Function   | 否        | -             | 取消回调函数                    |
| okText         | string     | 否        | "确定"        | 确定按钮文案                    |
| cancelText     | string     | 否        | "取消"        | 取消按钮文案                    |
| showLine       | boolean    | 否        | true          | 是否展示选中项上下边框          |
| separate       | string[]   | 否        | -             | 相邻列中的分隔符                |
| popupProps     | PopupProps | 否        | -             | antd-mobile 中 Popup 组件的属性 |
