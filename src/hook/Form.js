import React, { useEffect, useState } from "react";
import { Card, Input, Select, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styles from "./form.module.css";
import * as yup from "yup";
import isEmpty from "lodash.isempty";

const userSchema = yup.object().shape({
  username: yup.string().required("*Vui lòng nhập").matches(/^[a-zA-Z]/,"*Nhập kí tự chữ bắt đầu"),
  password: yup.string().required("*Vui lòng nhập").min(8, "*Nhập ít nhất 8 kí tự").max(16, "*Nhập tối đa 16 kí tự"),
  name: yup.string().required("*Vui lòng nhập").matches(/[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/, "*Chỉ được nhập chữ"),
  email: yup.string().matches(/^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/, "*Vui lòng nhập email!"),
  phone: yup.string().min(10,"*Nhập số điện thoại hợp lệ").max(11,"*Nhập số điện thoại hợp lệ").matches(/^[0][0-9]*$/, "*Vui lòng nhập SĐT hợp lệ!"),
  role: yup.string().required("*Vui lòng nhập")
})

function Form(props) {
  const [user, setUser] = useState({
    id: '',
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    role: ''
  });
  const [errors, setErrors] = useState([])

  const handleChange = (e) => {
    // console.log(e.target.value);
    setUser({ ...user, [e.target.name]: e.target.value })
  };

  const handleSelect = (name, value) => {
    // console.log(name,value);
    setUser({ ...user, [name]: value })
  }

  async function validateForm() {
    const ValidationErrors = {}
    try {
      await userSchema.validate(user, { abortEarly: false });
    } catch (err) {
      const errObject = { ...err };
      errObject.inner.forEach(validateErr => {
        if (ValidationErrors[validateErr.path]) return;
        ValidationErrors[validateErr.path] = validateErr.message;
      })
      setErrors(ValidationErrors);
    }
    return isEmpty(ValidationErrors)
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({})
    const isValid = await validateForm();

    if (!isValid) return;
    
    if (props.selectedUser) {
      props.updateUser(user);
    }
    else {
      props.createUser({ ...user, id: Math.floor(Math.random() * 1000 + 1) });
    }
    resetForm();
  }

  const resetForm = () => [
    setUser({
      id: '',
      username: '',
      password: '',
      name: '',
      email: '',
      phone: '',
      role: ''
    })
  ]

  useEffect(() => {
    if (!props.selectedUser) return;
    if (props.selectedUser.id === user.id) return;
    setUser(props.selectedUser);
  }, [props.selectedUser])

  return (
    <Card
      title="Form Đăng ký"
      headStyle={{
        backgroundColor: "#000000",
        color: "#ffffff",
      }}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Tài Khoản</label>
          <Input value={user.username} name="username" onChange={handleChange} placeholder="Tài khoản" prefix={<UserOutlined />} />
          <span style={{color:'red', fontWeight:'600'}}>{errors.username}</span>
        </div>

        <div className={styles.formGroup}>
          <label>Họ Tên</label>
          <Input value={user.name} name="name" onChange={handleChange} placeholder="Họ tên" prefix={<UserOutlined />} />
          <span style={{color:'red', fontWeight:'600'}}>{errors.name}</span>
        </div>

        <div className={styles.formGroup}>
          <label>Mật Khẩu</label>
          <Input
            value={user.password}
            name="password"
            onChange={handleChange}
            placeholder="Mật khẩu"
            type="password"
            prefix={<UserOutlined />}
          />
          <span style={{color:'red', fontWeight:'600'}}>{errors.password}</span>
        </div>

        <div className={styles.formGroup}>
          <label>Số điện thoại</label>
          <Input value={user.phone} name="phone" onChange={handleChange} placeholder="Số điện thoại" prefix={<UserOutlined />} />
          <span style={{color:'red', fontWeight:'600'}}>{errors.phone}</span>
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <Input value={user.email} name="email" onChange={handleChange} placeholder="Email" prefix={<UserOutlined />} />
          <span style={{color:'red', fontWeight:'600'}}>{errors.email}</span>
        </div>

        <div className={styles.formGroup}>
          <label>Mã loại người dùng</label>
          <Select value={user.role} onChange={e => handleSelect('role', e)} name='role' className={styles.select}>
            <Select.Option value="khachHang">Khách hàng</Select.Option>
            <Select.Option value="quanTri">Quản trị viên</Select.Option>
          </Select>
          <span style={{color:'red', fontWeight:'600'}}>{errors.role}</span>
        </div>

        <div className={styles.btn}>
          <Button htmlType="submit" type="primary">
            Submit
          </Button>
          <Button onClick={resetForm} type="default">Reset</Button>
        </div>
      </form>
    </Card>
  );
}

export default Form;
