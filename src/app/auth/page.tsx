'use client'
import type { NextPage } from 'next'
import { useState, useEffect } from 'react';
import { ConfigProvider, message } from 'antd'
import { useRouter } from 'next/navigation'
import PageLoading from "../../components/PageLoading";
import LoginForm from '@/components/LoginForm'
import { DEFAULT_LOGIN_DATA } from './constant';
import { TLoginData } from './type';
import { GetLocalAuthDataService, UpdateLocalAuthDataService, LoginService } from './query'

const Page: NextPage = () => {
  const router = useRouter()
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(true);
  const [isShowFrom, setIsShowFrom] = useState(true)
  const [loginData, setLoginData] = useState<TLoginData>(DEFAULT_LOGIN_DATA)

  // Handle form submit
  const handleLogin = async (values: any) => {
    // return
    try {
      const result = await LoginService(values)
      // const result = await LoginService({ domain: 'ergou-translate', code: '', remember: true })
      await UpdateLocalAuthDataService(result)
      messageApi.info("验证成功!");
      router.replace('/')
    } catch (error: any) {
      setIsShowFrom(true)
      return messageApi.warning(error.message);
    }
  };

  // 初始化数据
  useEffect(() => {
    // 自动验证则隐藏表单
    const autoConfrim = new URLSearchParams(window.location.search).get('confirm');
    if (autoConfrim && autoConfrim === 'true') { setIsShowFrom(false) }
    // 定义异步函数
    const fetchData = async () => {
      const localData = await GetLocalAuthDataService();
      // 已经登录直接跳转
      if (localData.key) {
        router.replace('/')
      }
      // 没登录初始化验证数据, 默认记住验证码
      const newData = loginData
      // 写入当前域名
      newData.domain = window.location.hostname.split('.')[0]
      // 如果缓存开启记住验证码，从缓存获取
      if (localData.remember) {
        newData.code = localData.code
      }
      // 如果链接有验证码参数，从链接取
      const pwd = new URLSearchParams(window.location.search).get('pwd');
      if (pwd) { newData.code = pwd }

      // 重置验证数据
      setLoginData(newData);
    };
    // 获取数据
    fetchData();

    // 关闭Loading
    setTimeout(() => {
      setIsLoading(false);
    }, 300);

    // 禁止页面缩放
    document
      .getElementsByName("viewport")[0]
      .setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      );
  }, [router, loginData]);

  // 渲染页面
  if (isLoading) {
    return (
      <div className="flex h-screen">
        <PageLoading />
      </div>
    )
  }
  return (
    <ConfigProvider
      theme={{
        "token": {
          "colorPrimary": "#000",
          "colorInfo": "#7728f5",
        }
      }}
    >
      <div id="auth-container" className='relative flex h-screen flex-col sm:p-12 bg-[#f5f5f5] h-100vh w-full justify-center'>
        <div className="relative w-full h-full flex flex-col sm:p-6 justify-center bg-white sm:border-[1px] sm:border-solid sm:border-[rgba(222,222,222,1)] sm:rounded-2xl sm:shadow-xl max-w-[1200px] items-center m-auto">
          {
            isShowFrom && <div className="absolute left-6 top-6 w-[120px]">
              <img width="100%" height="auto" src="/images/banner.png" alt="logo" />
            </div>

          }
          <div className={isShowFrom ? '' : 'opacity-0'}>
            <LoginForm msg={'test'} data={loginData} onSubmit={handleLogin} />
          </div>
          {!isShowFrom && <div className="absolute w-full">
            <PageLoading />
          </div>}
        </div>
      </div>
      <>{contextHolder}</>
    </ConfigProvider>
  )

}

export default Page
