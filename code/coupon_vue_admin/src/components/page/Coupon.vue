<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-vipcard"></i> 券码</el-breadcrumb-item>
        <el-breadcrumb-item>券码管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="param.businessCode" placeholder="筛选商户" class="handle-select mr10" @change="searchCouponType">
          <el-option :key="index" :label="item.businessName" :value="item.businessCode" v-for="(item, index) in businessArr"></el-option>
        </el-select>
        <el-select v-model="param.couponType" placeholder="请选择" class="handle-select mr10" v-if="param.businessCode">
          <el-option :key="index" :label="item.name" :value="item.code" v-for="(item, index) in couponTypeArr"></el-option>
        </el-select>
        <el-select v-model="param.channelCode" placeholder="筛选渠道" class="handle-select mr10">
          <el-option :key="index" :label="item.channelName" :value="item.channelCode" v-for="(item, index) in channelArr"></el-option>
        </el-select>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-button type="primary" @click="generateCoupon">券码批量生成</el-button>
        <el-button type="primary" @click="distributeAllCoupon">券码批量分发</el-button>
      </div>
      <el-table :data="tableData" stripe border>
        <el-table-column v-for="item in columns" :key="item.id" :prop="item.field" :label="item.Text" :align="item.align?item.align:'center'"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <div>
              <el-button type="text" @click="distributeCoupon(scope.$index, scope.row)">批量分发</el-button>
            </div> -->
            <router-link target="_blank" :to="{path:'/couponDetail',query:{'businessCode':scope.row.businessCode}}">查看详情</router-link>
            <div>
              <el-button type="text" @click="exportCouponDia(scope.$index, scope.row)">导出报表</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
          <el-pagination background @current-change="currentChange" layout="total, prev, pager, next" :page-size="param.pageSize" :total="total">
          </el-pagination>
      </div>
    </div>
    <!-- 编券码批量生成弹出框 -->
    <el-dialog title="券码批量生成" :visible.sync="generateCoupVisible" width="700px" :closeOnPressEscape="false" :closeOnClickModal="false" @close="cancelGenerateCoup">
      <el-form ref="generateCoupForm" :model="generateCoupForm" :rules="generateCoupFormRules" label-width="110px">
        <el-form-item label="商户名称" prop="businessCode">
          <el-select v-model="generateCoupForm.businessCode" placeholder="请选择" @change="getCouponType($event,1)">
            <el-option :key="index" :label="item.businessName" :value="item.businessCode" v-for="(item, index) in businessArr"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="coupon-type" label="券码种类" prop="couponTypes" v-if="couponTypeArr && couponTypeArr.length > 0">
          <el-checkbox-group v-model="generateCoupForm.couponTypes">
              <el-checkbox :label="item.code" v-for="(item, index) in couponTypeArr">{{item.name}}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
          <el-form-item label="数量" prop="num">
              <el-input v-model.number="generateCoupForm.num"></el-input>
          </el-form-item>
        <el-form-item label="截止有效期" prop="endTime">
          <el-date-picker v-model="generateCoupForm.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="cancelGenerateCoup">取 消</el-button>
          <el-button type="primary" @click="saveGenerateCoup">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编券码批量分发弹出框 -->
    <el-dialog title="券码批量分发" :visible.sync="distCoupVisible" width="700px" :closeOnPressEscape="false" :closeOnClickModal="false" @close="cancelDistCoup">
      <el-form ref="distCoupForm" :model="distCoupForm" :rules="distCoupFormRules" label-width="90px">
        <el-form-item label="商户名称" prop="businessCode">
          <el-select v-model="distCoupForm.businessCode" placeholder="请选择" @change="getCouponType($event,1)">
            <el-option :key="index" :label="item.businessName" :value="item.businessCode" v-for="(item, index) in businessArr"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="券码种类" prop="couponTypes"  v-if="couponTypeArr && couponTypeArr.length > 0">
          <el-checkbox-group v-model="distCoupForm.couponTypes">
            <el-checkbox :label="item.code" v-for="(item, index) in couponTypeArr">{{item.name}}</el-checkbox>
          </el-checkbox-group>
          <!-- <el-select v-model="distCoupForm.couponType" placeholder="请选择" :disabled="true">
            <el-option :key="index" :label="item.name" :value="item.code" v-for="(item, index) in couponTypeArr"></el-option>
          </el-select> -->
        </el-form-item>
          <el-form-item label="渠道名称" prop="channelCodes">
            <el-checkbox-group v-model="distCoupForm.channelCodes">
              <el-checkbox :key="index" :label="item.channelCode" v-for="(item, index) in channelArr">{{item.channelName}}</el-checkbox>
            </el-checkbox-group>
            <!-- <el-select v-model="distCoupForm.channelCode" placeholder="请选择">
            <el-option :key="index" :label="item.channelName" :value="item.channelCode" v-for="(item, index) in channelArr"></el-option>
          </el-select> -->
          </el-form-item>
          <el-form-item label="数量" prop="num">
              <el-input v-model="distCoupForm.num"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="cancelDistCoup">取 消</el-button>
          <el-button type="primary" @click="saveDistCoup">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 导出筛选 -->
    <el-dialog title="导出报表" :visible.sync="exportStatusVisible" width="500px" center :closeOnPressEscape="false" :closeOnClickModal="false">
      <div class="del-dialog-cnt">
      <el-form :model="exportForm" >
        <el-form-item label="券码核销时间" label-width="100px">
          <el-date-picker class="mr10" v-model="exportForm.createDate" type="daterange" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions" >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="券码状态"  label-width="100px">
          <el-select v-model="exportForm.exportStatus" placeholder="券码状态">
          <el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in writeOffStatusArr"></el-option>
        </el-select>
        </el-form-item>
      </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="exportStatusVisible = false">取 消</el-button>
          <el-button type="primary" @click="exportCoupon">确 定</el-button>
      </span>
    </el-dialog>
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
      businessArr:[],
      channelArr:[],
      couponTypeArr:[],
      writeOffStatusArr:this.dataJs.writeOffStatusArr,
      enableArr:this.dataJs.enableArr,
      columns:[
        {field:'businessName',Text:'商户名称'},
        {field:'channelName',Text:'渠道名称'},
        {field:'couponTypeName',Text:'券码种类'},
        {field:'typePrice',Text:'券码金额'},
        {field:'couponTotal',Text:'券码总量'},
        {field:'unWriteOff',Text:'未核销券码数量',minWidth:120},
        {field:'writeOff',Text:'已核销券码数量',minWidth:120},
        {field:'updateTime',Text:'更新时间'}
      ],
      tableData:null,
      total:0,
      param:{
        pageIndex:1,
        pageSize:20,
        businessCode:'',
        channelCode:'',
        couponType:''
      },
      cloneParam:null,
      generateCoupForm:{
        businessCode:'',
        couponTypes:[],  //券码种类编码
        num:0
      },
      distCoupForm:{
        businessCode:'',
        couponTypes:[],
        channelCodes:[],
        num:0
      },
      exportForm:{
        exportStatus:'',  //导出券码状态
        createDate:[],
      },
      exportCouponId:'',
      exportStatusVisible:false,
      generateCoupVisible:false,
      distCoupVisible:false,
      generateCoupFormRules:{
        businessCode:[{required: true, message: '请选择商户',trigger: 'change' }],
        endTime:[{required: true, message: '请选择券码截止有效期',trigger: 'change' }],
        couponTypes:[{type: 'array', required: true, message: '请至少选择一个券码种类',trigger: 'change' }]
      },
      distCoupFormRules:{
        couponTypes:[{type: 'array', required: true, message: '请至少选择一个券码种类',trigger: 'change' }],
        channelCodes:[{type: 'array', required: true, message: '请至少选择一个渠道号',trigger: 'change' }]
      }
    }
  },
  mounted(){
    this.getData();
    this.getAllBusiness();
    this.getAllChannel();
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
    //获取所有券码种类
    getCouponType(e,type){
      if(type === 1){
        this.generateCoupForm.couponTypes = [];
      }else{
         this.distCoupForm.couponTypes = [];
      }
      let param = {
        businessCode:e,
        enable:1
      }
      this.$ajax.getAllCouponTypeList(param, res => {
        this.couponTypeArr = res.data.results;
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
    //选中批量分发的渠道
    checkedChannelChange(){
      // let checkedCount = value.length;
      //   this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
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
      this.getData();
    },
    /**
     * 获取列表数据
     */
    getData(){
      this.cloneParam = this.param;
      this.$ajax.statCoupon(this.cloneParam, res => {
        this.tableData = res.data.results;
        this.total = res.data.total;
      })
    },
    /**
     * 券码批量生成
     */
    generateCoupon(){
      this.couponTypeArr = [];
      this.generateCoupForm = {
        businessCode:'',
        couponTypes:[],
        num:0
      }
      this.generateCoupVisible = true;
    },
    /**
     * 券码批量分发
     */
    distributeAllCoupon(){
      this.couponTypeArr = [];
      this.distCoupForm = {
        businessCode:'',
        couponTypes:[],
        channelCodes:[],
        num:0
      }
      this.distCoupVisible = true;
    },
    /**
     * 券码批量分发
     */
    distributeCoupon(index, row){
      console.log(this.couponTypeArr);
      this.idx = index;
      const item = this.tableData[index];
      this.distCoupForm.businessCode = item.businessCode;
      this.distCoupForm.couponTypes = [];
      this.distCoupForm.couponTypes.push(item.couponType);
      this.distCoupVisible = true;
    },
    /**
     * 卡券批量导出
     */
    exportCouponDia(index, row){
      this.exportForm.exportStatus = "";
      this.exportStatusVisible = true;
      this.exportCouponId = this.tableData[index];
    },
    exportCoupon(){
      let startWriteOffTime = "", endWriteOffTime = "";
      if(this.exportForm.createDate && this.exportForm.createDate.length == 2){
        startWriteOffTime = this.exportForm.createDate[0];
        endWriteOffTime = this.exportForm.createDate[1];
      }
      let param = "couponType="+this.exportCouponId.couponType+"&businessCode="+this.exportCouponId.businessCode+"&channelCode="+this.exportCouponId.channelCode+"&status="+this.exportForm.exportStatus+"&startWriteOffTime="+startWriteOffTime+"&endWriteOffTime="+endWriteOffTime
      this.$ajax.exportCoupon(param)
    },
    /**
     * 关闭弹窗重置弹窗内容(批量生成)
     */
    cancelGenerateCoup(){
      this.$refs.generateCoupForm.resetFields();
      this.generateCoupVisible = false;
    },
    /**
     * 保存
     */
    saveGenerateCoup(){
      console.log( this.generateCoupForm);
      this.$refs.generateCoupForm.validate(valid =>{
        if(valid){
          this.batchGenerateCouponList(this.generateCoupForm)
        }else{
          return;
        }
      })
    },
    /**
     * 批量生成
     */
    batchGenerateCouponList(param){
      this.$ajax.batchGenerateCouponList(param, res =>{
        this.$message({
          type: "success",
          message: "批量生成成功"
        });
        this.getData();
        this.cancelGenerateCoup();
      });
    },
    /**
     * 关闭弹窗重置弹窗内容（批量分发）
     */
    cancelDistCoup(){
      this.$refs.distCoupForm.resetFields();
      this.distCoupVisible = false;
    },
    /**
     * 批量分发保存
     */
    saveDistCoup(){
      console.log( this.distCoupForm);
      this.$refs.distCoupForm.validate(valid =>{
        if(valid){
            this.batchDistributeCoupon(this.distCoupForm);
        }else{
          return;
        }
      })
    },
    /**
     * 批量分发
     */
    batchDistributeCoupon(param){
      this.$ajax.batchDistributeCoupon(param, res =>{
        this.$message({
          type: "success",
          message: "批量分发成功"
        });
        this.getData();
        this.cancelDistCoup();
      });
    },
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
  /*.coupon-type{
    max-height:400px;
    overflow-y:scroll;
  }*/
</style>
