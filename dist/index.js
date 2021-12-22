var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from 'react';
import PickerViewUI from './picker-view';
import { findItem, hasVal } from './util';
import './index.less';
export default class PickerView extends React.Component {
    constructor(props) {
        super(props);
        this.handleOk = () => {
            const { onChange, onClose } = this.props;
            onChange === null || onChange === void 0 ? void 0 : onChange(this.values, this.results);
            onClose === null || onClose === void 0 ? void 0 : onClose();
        };
        this.handleCancel = () => {
            const { onClose, onCancel } = this.props;
            onCancel === null || onCancel === void 0 ? void 0 : onCancel();
            onClose === null || onClose === void 0 ? void 0 : onClose();
        };
        this.handleChange = (values, results) => {
            this.values = values;
            this.results = results;
            const { onListScroll } = this.props;
            onListScroll === null || onListScroll === void 0 ? void 0 : onListScroll(values, results);
        };
        const { defaultValue, options } = props;
        const initValue = Array.isArray(defaultValue) ? defaultValue : [];
        this.values = options.map((item, i) => {
            var _a;
            if (hasVal(initValue[i], options[i])) {
                return initValue[i];
            }
            return (_a = item[0]) === null || _a === void 0 ? void 0 : _a.value;
        });
        this.results = new Array(options.length).fill(null).map((v, i) => {
            if (Array.isArray(options[i])) {
                return findItem(this.values[i], options[i]);
            }
            return null;
        });
    }
    render() {
        const _a = this.props, { onChange, onCancel, onListScroll } = _a, props = __rest(_a, ["onChange", "onCancel", "onListScroll"]);
        return (React.createElement(PickerViewUI, Object.assign({ onOk: this.handleOk, onCancel: this.handleCancel, onChange: this.handleChange }, props)));
    }
}
