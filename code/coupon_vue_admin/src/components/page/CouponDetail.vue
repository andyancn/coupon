<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-vipcard"></i> 券码</el-breadcrumb-item>
        <el-breadcrumb-item>券码管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!-- <div class="handle-box"> -->
        <el-select v-model="param.businessCode" placeholder="筛选商户" class="handle-select mr10 mb10" @change="searchCouponType">
          <el-option :key="index" :label="item.businessName" :value="item.businessCode" v-for="(item, index) in businessArr"></el-option>
        </el-select>
        <el-select v-model="param.couponType" placeholder="筛选券码种类" class="handle-select mr10 mb10" v-if="param.businessCode">
          <el-option :key="index" :label="item.name" :value="item.code" v-for="(item, index) in couponTypeArr"></el-option>
        </el-select>
        <el-select v-model="param.channelCode" placeholder="筛选渠道" class="handle-select mr10 mb10">
          <el-option :key="index" :label="item.channelName" :value="item.channelCode" v-for="(item, index) in channelArr"></el-option>
        </el-select>
        <el-select v-model="param.status" placeholder="筛选券码状态" class="handle-select mr10 mb10">
          <el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in writeOffStatusArr"></el-option>
        </el-select>
        <el-input v-model="param.coupon" placeholder="输入券码编号" class="handle-input mr10 mb10"></el-input>
        <el-input v-model="param.distributeSeq" placeholder="输入券码批次号" class="handle-input mr10 mb10"></el-input>
      <!-- </div> -->
      <!-- <div class="handle-box"> -->
        <el-date-picker class="mr10 mb10" v-model="distributeDate" type="daterange" align="right" range-separator="至" start-placeholder="券码分发开始日期" end-placeholder="券码分发结束日期" value-format="yyyy-MM-dd" :picker-options="pickerDistributeOptions"></el-date-picker>
        <el-date-picker class="mr10 mb10" v-model="createDate" type="daterange" align="right" range-separator="至" start-placeholder="券码核销开始日期" end-placeholder="券码核销结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
        <el-button type="primary" icon="search" @click="search" class="mb10">搜索</el-button>
        <el-button type="primary" icon="search" @click="exportCoupon" class="mb10">根据筛选导出</el-button>
      <!-- </div> -->
      <el-table :data="tableData" stripe border>
        <el-table-column v-for="item in columns" :key="item.id" :prop="item.field" :label="item.Text" :width="item.Width?item.Width:''" :min-width="item.minWidth?item.minWidth:'100'" :align="item.align?item.align:'center'"></el-table-column>
      </el-table>
      <div class="pagination">
          <el-pagination background @current-change="currentChange" layout="total, prev, pager, next" :page-size="param.pageSize" :total="total">
          </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      pickerDistributeOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      businessArr:[],
      channelArr:[],
      couponTypeArr:[],
      enableArr:this.dataJs.enableArr,
      writeOffStatusArr:this.dataJs.writeOffStatusArr,
      columns:[
        {field:'coupon',Text:'券码',minWidth:70},
        {field:'statusDesc',Text:'券码状态',minWidth:70},
        {field:'businessName',Text:'商户名称'},
        {field:'couponTypeName',Text:'券码种类'},
        {field:'channelName',Text:'渠道名称'},
        {field:'price',Text:'金额',minWidth:60},
        {field:'distributeSeq',Text:'批次号'},
        {field:'distributeTime',Text:'分发时间',minWidth:70},
        {field:'writeOffAccountName',Text:'核销门店'},
        {field:'writeOffTime',Text:'核销时间',minWidth:70},
        {field:'endTime',Text:'有效截止时间',minWidth:70},
        
      ],
      tableData:null,
      total:0,
      param:{
        pageIndex:1,
        pageSize:20,
        businessCode:'',
        channelCode:'',
        couponType:'',
        status:'',
        coupon :'',
        distributeSeq:'',
        startWriteOffTime:'',
        endWriteOffTime:'',
        startDistributeTime:'',
        endDistributeTime:''
      },
      createDate:[],
      distributeDate:[],
    }
  },
  mounted() {
    this.getAllBusiness();
    this.getAllChannel();
    if(this.$route.query.businessCode){
      this.param.businessCode = this.$route.query.businessCode;
      console.log( this.param.businessCode);
      this.getData();
      this.searchCouponType();
    }
  },
  methods: {
    //获取所有商户信息
    getAllBusiness(){
      this.$ajax.getAllBusinessList(res => {
        this.businessArr = res.data.results;
      })
    },
    //获取所有渠道信息
    getAllChannel(){
      this.$ajax.getAllChannelList(res => {
        this.channelArr = res.data.results;
      })
    },
    searchCouponType(){
      this.param.couponType = "";
      console.log(this.param.couponType);
      let param = {
        businessCode:this.param.businessCode,
        enable:1
      }
      this.$ajax.getAllCouponTypeList(param, res => {
        this.couponTypeArr = res.data.results;
      })
    },
    // 分页导航
    currentChange(val) {
      this.param.pageIndex = val;
      this.getData();
    },
    /**
     * 搜索
     */
    search() {
      this.param.pageIndex = 1;
      console.log(this.param);
      // if(!this.param.businessCode){
      //   this.$message.error('商户编码不能为空！')
      //   return;
      // }
      this.getData();
    },
    /**
     * 获取列表数据
     */
    getData(){
      if(this.createDate && this.createDate.length == 2){
        this.param.startWriteOffTime = this.createDate[0];
        this.param.endWriteOffTime = this.createDate[1];
      }else{
        this.param.startWriteOffTime = '';
        this.param.endWriteOffTime = '';
      }
      if(this.distributeDate && this.distributeDate.length == 2){
        this.param.startDistributeTime = this.distributeDate[0];
        this.param.endDistributeTime = this.distributeDate[1];
      }else{
        this.param.startDistributeTime = '';
        this.param.endDistributeTime = '';
      }
      this.param.endWriteOffTime = this.param.endWriteOffTime != '' ? (this.param.endWriteOffTime.indexOf(' 23:59:59') > -1 ? this.param.endWriteOffTime : this.param.endWriteOffTime+' 23:59:59') : '' ;
      this.param.endDistributeTime = this.param.endDistributeTime != '' ? (this.param.endDistributeTime.indexOf(' 23:59:59') > -1 ? this.param.endDistributeTime : this.param.endDistributeTime+' 23:59:59') : '' ;
      this.$ajax.getCouponList(this.param, res => {
        this.tableData = res.data.results;
        this.total = res.data.total;
      })
    },
    /**
    * 券码导出
    */
    exportCoupon(){
      //券码核销时间
      if(this.createDate && this.createDate.length == 2){
        this.param.startWriteOffTime = this.createDate[0];
        this.param.endWriteOffTime = this.createDate[1];
      }else{
        this.param.startWriteOffTime = '';
        this.param.endWriteOffTime = '';
      }
      //分发时间
       if(this.distributeDate && this.distributeDate.length == 2){
        this.param.startDistributeTime = this.distributeDate[0];
        this.param.endDistributeTime = this.distributeDate[1];
      }else{
        this.param.startDistributeTime = '';
        this.param.endDistributeTime = '';
      }

      this.param.endWriteOffTime = this.param.endWriteOffTime != '' ? (this.param.endWriteOffTime.indexOf(' 23:59:59') > -1 ? this.param.endWriteOffTime : this.param.endWriteOffTime+' 23:59:59') : '';
      this.param.endDistributeTime = this.param.endDistributeTime != '' ? (this.param.endDistributeTime.indexOf(' 23:59:59') > -1 ? this.param.endDistributeTime : this.param.endDistributeTime+' 23:59:59') : '' ;

      let param = "distributeSeq="+this.param.distributeSeq+"&couponType="+this.param.couponType+"&businessCode="+this.param.businessCode+"&channelCode="+this.param.channelCode+"&status="+this.param.status+"&startWriteOffTime="+this.param.startWriteOffTime+"&endWriteOffTime="+this.param.endWriteOffTime+"&startDistributeTime="+this.param.startDistributeTime+"&endDistributeTime="+this.param.endDistributeTime
      this.$ajax.exportCoupon(param)
    }
  }
}
</script>


<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }
  .handle-input {
    width: 220px;
    display: inline-block;
  }
</style>
