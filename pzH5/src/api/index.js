import request from '../utils/request'

export default{
    login(data){
        return request.post('/login',data)
    },
    //首页
    index(){
        return request.get('/index/index')
    },
    //订单详情信息
    h5Companion(){
        return request.get('/h5/companion')
    },
    //提交订单
    submit(data){
        return request.post('/createOrder',data)
    },
    //订单列表
    orderList(params){
        return request.get('/order/list',{params})
    },
    //订单详情页
    orderDetail(params){
        return request.get('/order/detail',{params})
    },
}