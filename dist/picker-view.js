import React, { useState, useEffect, useMemo } from 'react';
import classnames from 'classnames';
import { Popup } from 'antd-mobile';
import List from './List';
import { PREFIX_CLS } from './util';
function indexOf(val, arr, def = 0) {
    let index = def;
    arr.some((item, i) => {
        if (item.value === val) {
            index = i;
            return true;
        }
        return false;
    });
    return index;
}
const PickerViewUI = ({ prefix = PREFIX_CLS, title = '请选择', options, defaultValue, value, onChange, visible, onCancel, onOk, okText = '确定', cancelText = '取消', showLine = true, separate, popupProps = {} }) => {
    const defValue = value || defaultValue;
    const newValues = Array.isArray(defValue) ? defValue : [defValue];
    const curValues = options.map((option, i) => {
        const curValue = newValues[i];
        return indexOf(curValue, option, -1) >= 0 ? curValue : option[0].value;
    });
    const [values, setValues] = useState(curValues);
    useEffect(() => {
        setValues(options.map((option, i) => {
            return indexOf(values[i], option, -1) >= 0 ? values[i] : option[0].value;
        }));
    }, [...options]);
    useEffect(() => {
        if (value !== undefined) {
            const nvs = Array.isArray(value) ? value : [value];
            setValues(options.map((option, i) => (indexOf(nvs[i], option, -1) >= 0 ? nvs[i] : option[0].value)));
        }
    }, [value]);
    const handleCancel = () => {
        onCancel === null || onCancel === void 0 ? void 0 : onCancel();
        if (value === undefined) {
            setValues(curValues);
        }
    };
    const handleOk = () => {
        onOk === null || onOk === void 0 ? void 0 : onOk();
    };
    const result = useMemo(() => values.map((v, i) => indexOf(v, options[i])), [values]);
    const handleListChange = (index, i) => {
        const newValues = [...values];
        const selected = options[i][index];
        newValues[i] = selected ? selected.value : options[i][0].value;
        setValues(newValues);
        onChange === null || onChange === void 0 ? void 0 : onChange([...newValues], newValues.map((v, i) => {
            const curArr = options[i];
            for (let len = curArr.length, k = 0; k < len; k++) {
                if (curArr[k].value === v) {
                    return curArr[k];
                }
            }
            return null;
        }));
    };
    return (React.createElement(Popup, Object.assign({}, popupProps, { className: classnames(prefix, popupProps.className), visible: visible, afterClose: handleCancel, onMaskClick: handleCancel }),
        React.createElement("div", { className: `${prefix}-header` },
            React.createElement("div", { className: classnames(`${prefix}-header-btn`, 'cancel'), onClick: handleCancel }, cancelText),
            React.createElement("div", { className: `${prefix}-header-title` }, title),
            React.createElement("div", { className: classnames(`${prefix}-header-btn`, 'ok'), onClick: handleOk }, okText)),
        React.createElement("div", { className: `${prefix}-body` },
            React.createElement("div", { className: `${prefix}-content` }, options.map((list, i) => Array.isArray(list) && list.length ? (React.createElement(List, { current: result[i], onChange: (index) => handleListChange(index, i), list: list, key: `list-wrap-${i}` })) : null)),
            React.createElement("div", { className: `${prefix}-mask` },
                React.createElement("div", { className: `${prefix}-mask-top` }),
                React.createElement("div", { className: classnames(`${prefix}-mask-middle`, { 'show-line': showLine }) },
                    React.createElement("p", { className: `${prefix}-sep-wrap` }, separate === null || separate === void 0 ? void 0 : separate.map((sep, index) => (React.createElement("span", { key: `${sep}-${index}`, className: `${prefix}-sep`, style: { left: `${((index + 1) / options.length) * 100}%` } }, sep))))),
                React.createElement("div", { className: `${prefix}-mask-bottom` })))));
};
export default PickerViewUI;
