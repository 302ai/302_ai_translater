'use client'
import React, { useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { ILoginData } from '@/app/G5mSg9DW6c4h/type';

interface LoginProps {
  msg: string,
  data: ILoginData | {}
  onSubmit: (data: ILoginData) => Promise<any>
}

const AdminForm = ({ msg, data, onSubmit }: LoginProps) => {
  const [form] = Form.useForm();

  // handle form submit
  const onFinish = async (values: any) => {
    await onSubmit(values)
  };

  // reset code
  useEffect(() => {
    if (msg) {
      form.setFieldValue('code', '')
    }
  }, [msg, form])

  return (
    <div className="login-form">
      <div className="w-full text-center">
        <div className="title text-xl font-bold p-4">翻译大师数据管理后台</div>
        <div className=" text-sm  ">请在下方输入管理员账户信息</div>
      </div>
      <Form
        form={form}
        layout="inline"
        name="normal_login"
        className="login-form p-4 felx justify-center"
        initialValues={data}
        onFinish={onFinish}
      >
        <div className="flex flex-col px-4 justify-center">
          <Form.Item
            name="username"
            rules={[]}
            style={{ marginTop: "10px", textAlign: "center" }}
          >
            <Input
              type="text"
              placeholder='输入用户名'
              style={{ borderRadius: '8px', width: "200px", textAlign: 'center' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[]}
            style={{ marginTop: "10px", textAlign: "center" }}
          >
            <Input
              type="password"
              placeholder="请输入密码"
              style={{ borderRadius: '8px', width: "200px", textAlign: 'center' }}
            />
          </Form.Item>

          <Form.Item
            className='text-center flex justify-center'
            style={{ marginTop: "20px" }}
          >
            <Button type="primary" style={{ width: "200px", color: "#fff", borderRadius: '8px' }} htmlType="submit" className="login-form-button">
              确认
            </Button>
          </Form.Item>
          {/* <Form.Item
            style={{ marginTop: "10px", textAlign: "center" }}
          >
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox style={{ fontSize: '12px', margin: 'auto' }}>记住账户</Checkbox>
            </Form.Item>
          </Form.Item> */}
        </div>

      </Form>
    </div >
  )
}

export default AdminForm
