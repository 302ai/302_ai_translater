'use client'
import React, { useEffect, useContext } from 'react';
import AppContext from '../store';
import { LockIcon } from './MyIcon';
import { Button, Checkbox, Form, Input } from 'antd';
import { TLoginData } from '@/app/auth/type';
// Locales
import Locale from "../locales";

interface LoginProps {
  msg: string,
  data: TLoginData | {}
  onSubmit: (data: TLoginData) => Promise<any>
}

const LoginForm = ({ msg, data, onSubmit }: LoginProps) => {
  const globalState = useContext(AppContext);
  const [form] = Form.useForm();

  // handle form submit
  const onFinish = async (values: any) => {
    await onSubmit(values)
  };

  // auto confirm
  useEffect(() => {
    form.submit()
  }, [form])

  // reset code
  useEffect(() => {
    if (msg) {
      form.setFieldValue('code', '')
    }
  }, [msg, form])

  return (
    <div className="login-form">
      <div className="w-full text-center">
        <div className="p-4">
          <LockIcon style={{ fontSize: "40px" }} />
        </div>
        <div className="title text-lg font-bold p-2">{Locale.Auth.NeedCode}</div>
        <div className=" text-sm  ">{Locale.Auth.InputCode}</div>
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
            hidden
            name="uuid"
            rules={[]}
            style={{ marginTop: "10px", textAlign: "center" }}
          >
            <Input
              style={{ borderRadius: '8px', width: "200px", textAlign: 'center' }}
            />
          </Form.Item>

          <Form.Item
            hidden
            name="domain"
            rules={[]}
            style={{ marginTop: "10px", textAlign: "center" }}
          >
            <Input
              type="password"
              style={{ borderRadius: '8px', width: "200px", textAlign: 'center' }}
            />
          </Form.Item>

          <Form.Item
            name="code"
            rules={[]}
            style={{ marginTop: "10px", textAlign: "center" }}
          >
            <Input
              type="password"
              placeholder={Locale.Auth.PlaceHodeer}
              style={{ borderRadius: '8px', width: "200px", textAlign: 'center' }}
            />
          </Form.Item>

          {
            msg && msg.includes('禁用') ? (
              <div className="flex justify-center text-center flex-wrap">
                <span className='text-[red]'>{Locale.Auth.ToolBin}</span>
                <a href={globalState.domain} target='_blank'>302.AI</a>
              </div>
            ) : null
          }

          {
            msg && msg.includes('注销') ? (
              <div className="flex justify-center text-center flex-wrap">
                <span className='text-[red]'>{Locale.Auth.ToolDel}</span>
                <a href={globalState.domain} target='_blank'>302.AI</a>
              </div>
            ) : null
          }

          <Form.Item
            className='text-center flex justify-center'
            style={{ marginTop: "20px" }}
          >
            <Button type="primary" style={{ width: "200px", color: "#fff", borderRadius: '8px' }} htmlType="submit" className="login-form-button">
              {Locale.Auth.Submit}
            </Button>
          </Form.Item>
          <Form.Item
            style={{ marginTop: "10px", textAlign: "center" }}
          >
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox style={{ fontSize: '12px', margin: 'auto' }}>{Locale.Auth.Remind}</Checkbox>
            </Form.Item>
          </Form.Item>
        </div>

      </Form>
    </div >

  )
}

export default LoginForm
