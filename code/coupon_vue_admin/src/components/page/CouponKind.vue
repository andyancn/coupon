<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-vipcard"></i> 券码</el-breadcrumb-item>
        <el-breadcrumb-item>券码种类管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="param.enable" placeholder="筛选启用状态" class="handle-select mr10">
          <el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in enableArr"></el-option>
        </el-select>
        <el-select v-model="param.businessCode" placeholder="筛选商户" class="handle-select mr10">
            <el-option :key="index" :label="item.businessName" :value="item.businessCode" v-for="(item, index) in businessArr"></el-option>
          </el-select>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
         <el-button type="primary" @click="add">新增</el-button>
      </div>
      <el-table :data="tableData" stripe border>
        <el-table-column v-for="item in columns" :key="item.id" :prop="item.field" :label="item.Text" :width="item.Width?item.Width:''" :min-width="item.minWidth?item.minWidth:'100'" :align="item.align?item.align:'center'"></el-table-column>
        <el-table-column prop="enable" label="启用状态" min-width="70" align="center" :formatter="formatEnable">
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="changeStatus(scope.$index,scope.row.enable)">{{scope.row.enable == 1 ? '停用':'开启'}}</el-button>
            <el-button type="text" icon="el-icon-edit" @click="edit(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
          <el-pagination background @current-change="currentChange" layout="total, prev, pager, next" :page-size="param.pageSize" :total="total">
          </el-pagination>
      </div>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog :title="titleForm === 'add' ? '添加新券码种类' : '修改券码种类'" :visible.sync="editVisible" width="500px" :closeOnPressEscape="false" :closeOnClickModal="false" @close="cancelForm">
      <el-form ref="form" :model="form" :rules="formRules" label-width="120px">
        <el-form-item label="商户名称" prop="businessCode">
          <el-select v-model="form.businessCode" placeholder="请选择">
            <el-option :key="index" :label="item.businessName" :value="item.businessCode" v-for="(item, index) in businessArr"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="券码种类id" v-if="titleForm === 'edit'">
          <el-input v-model="form.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="券码种类编号" prop="code" v-if="titleForm === 'edit'">
          <el-input v-model="form.code" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="券码种类名称" prop="name" v-if="titleForm === 'edit'">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="金额" prop="price" v-if="titleForm === 'edit'">
            <el-input v-model="form.price"></el-input>
        </el-form-item>
        <div class="el-form" v-for="(couponType, index) in form.couponTypes" v-if="titleForm === 'add'">
          <el-form-item :label="'券码种类名称'+(index+1)" :prop="'couponTypes.' + index + '.name'"
              :rules="{
                required: true, message: '券码种类名称不能为空', trigger: 'blur'
              }"
            >
              <el-input v-model="couponType.name"  style="width:217px;margin-right:20px;"></el-input>
              <label v-if="titleForm === 'add'">
                <el-button type="text" @click.prevent="addCouponType" v-if="index == 0">新增</el-button>
                <el-button type="text" @click.prevent="deteleCouponType(couponType)" v-else>删除</el-button>
              </label>
          </el-form-item>
             <el-form :model="form.couponTypes[index]"  label-width="120px">
                <el-form-item 
                  :label="'金额'+(index+1)+'_'+(subIndex +1)"
                  :prop="'price.' + subIndex+'.subPrice'"
                  v-for="(priceItem, subIndex) in form.couponTypes[index].price"
                  :rules="{
                    required: true, message: '金额不能为空,且必须为数字', trigger: 'blur'
                  }"
                >
                <el-input type="number" v-model="priceItem.subPrice" style="width:217px;margin-right:20px;"></el-input>
                <el-button type="text" @click.prevent="addPrice(index)" v-if="subIndex == 0">新增</el-button>
                <el-button type="text" @click.prevent="detelePrice(index,subIndex)" v-else>删除</el-button>
              </el-form-item>
          </el-form>
        </div>
        <el-form-item label="启用状态" prop="enable">
          <el-select v-model="form.enable" placeholder="请选择">
            <el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in enableArr"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="saveForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="enableVisible" width="300px" center :closeOnPressEscape="false" :closeOnClickModal="false">
      <div class="del-dialog-cnt">是否要{{enableObj.label}}该券码种类？</div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="enableVisible = false">取 消</el-button>
          <el-button type="primary" @click="enableComfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data() {
    return {
      businessArr: [],
      enableArr:this.dataJs.enableArr,
      columns:[
        // {field:'id',Text:'序号',minWidth:50},
        // {field:'businessCode',Text:'商户编号'},
        {field:'businessName',Text:'商户名称'},
        // {field:'code',Text:'券码种类编号',},
        {field:'name',Text:'券码种类名称'},
        {field:'price',Text:'金额'},
        // {field:'createTime',Text:'创建时间',minWidth:100},
        {field:'updateTime',Text:'更新时间',minWidth:100},
        {field:'remark',Text:'备注'}
      ],
      tableData:null,
      total:0,
      editVisible:false,
      enableVisible:false,
      enableObj:{
        label:'',
        value:''
      },
      titleForm:'add',
      param:{
        businessCode:'',
        pageIndex:1,
        pageSize:20,
        code:'',
        price:'',
        enable:1
      },
      form:{
        businessCode:'',
        code:'',
        name:'',
        couponTypes: [
          { 
            name: '',
            price:[
              {
                subPrice:''
              }
            ],
          }
        ],
        remark:'',
        enable:1
      },
      formRules:{
        businessCode:[{required: true, message: '请选择商户',trigger: 'change' }],
        price:[{required: true, message: '金额不能为空',trigger: 'blur,change' }],
        enable:[{required: true, message: '请选择启用状态',trigger: 'change' }]
      }
    }
  },
  mounted(){
    this.getData();
    this.getAllBusiness();
  },
  methods: {
    //获取所有商户信息
    getAllBusiness(){
      this.$ajax.getAllBusinessList(res => {
        console.log(res);
        this.businessArr = res.data.results;
      })
    },
    // 分页导航
    currentChange(val) {
      this.param.pageIndex = val;
      this.getData();
    },
    /**
     * 开启状态格式化
     */
    formatEnable(row, column) {
      return row.enable == 1 ? '开启' : (row.enable == 0 ? '停用' : '未知')
    },
    //是否启用或者停用该券码种类
    changeStatus(index,enable){
      this.enableObj = {
        index:index,
        label:enable == 1 ? '停用':'启用',
        value:enable == 1 ? 0 : 1
      } 
      this.enableVisible = true;
    },
    /**
     * 确认启用或停用该券码种类
     */
    enableComfirm(){
      let item = this.tableData[this.enableObj.index],
          param = {
            id:item.id,
            code:item.code,
            name:item.name,
            price:item.price,
            enable:this.enableObj.value,
            remark:item.remark
          }
      this.editAjax(param,1);
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
      this.$ajax.getCouponTypeList(this.param, res => {
        this.tableData = res.data.results;
        this.total = res.data.total;
      })
    },
    /**
     * 新增券码种类
     */
    add(){
      this.titleForm = 'add';
      this.form = {
        businessCode:'',
        code:'',
        name:'',
        couponTypes: [
          { 
            name: '',
            price:[
              {
                subPrice:''
              }
            ],
          }
        ],
        remark:'',
        enable:1
      }
      this.editVisible = true;
    },
    /**
     * 编辑
     */
    edit(index, row) {
      this.titleForm = 'edit';
      this.idx = index;
      const item = this.tableData[index];
      console.log(item);
      this.form = {
        id:item.id,
        businessCode:item.businessCode,
        code:item.code,
        name: item.name,
        price: item.price,
        remark:item.remark,
        enable:item.enable == 1 ? 1 : 0
      }
      this.editVisible = true;
    },
    /**
     * 关闭弹窗重置弹窗内容
     */
    cancelForm(){
      this.$refs['form'].resetFields();
      this.editVisible = false
    },
    /**
     * 保存
     */
    saveForm(){
      console.log( this.form);
      this.$refs.form.validate(valid =>{
        if(valid){
           if(this.titleForm == 'add'){
            this.addAjax(this.form);
          } else {
            this.editAjax(this.form,2);
          }
        }else{
          return;
        }
      })
    },
    /**
     * 调用编辑券码种类接口
     */
    editAjax(param,type){
      console.log(param);
      this.$ajax.editCouponType(param, res => {
        this.$message({
          type: "success",
          message: "修改成功"
        });
        this.getData();
        if(type === 1){
          this.enableVisible = false
        }else{
          this.cancelForm();
        }
      })
    },
    /**
     * 调用新增券码种类接口
     */
    addAjax(param){
      let couponTypes = [];
      param.couponTypes.forEach(item =>{ 
        item.price = item.price.map(subItem => {
          return subItem.subPrice;
        });
        couponTypes.push(item) 
      });
      console.log(param);
      let params = {
        businessCode:param.businessCode,
        couponTypes:couponTypes,
        remark:param.remark,
        enable:param.enable
      }
      console.log(this.form);
      this.$ajax.addCouponType(params, res => {
        this.$message({
          type: "success",
          message: "新增成功"
        });
        this.getData();
        this.cancelForm();
      })
    },
    /**
     * 新增价格
     */
    addCouponType(){
      this.form.couponTypes.push(
        {
          name:'',
          price: [
            {
              subPrice:''
            }
          ]
        }
      )
    },
    deteleCouponType(item){
      var index = this.form.couponTypes.indexOf(item)
      if (index !== -1) {
        this.form.couponTypes.splice(index, 1)
      }
    },
    /**
     * 新增价格
     */
    addPrice(index){
      this.form.couponTypes[index].price.push({subPrice:''})
    },
    detelePrice(couponTypeIndex,item){
      var index = this.form.couponTypes[couponTypeIndex].price.indexOf(item);
      if (index !== -1) {
        this.form.couponTypes[couponTypeIndex].price.splice(index, 1)
      }
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
