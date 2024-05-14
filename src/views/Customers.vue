<script setup lang="ts">
import {onMounted, ref, computed} from "vue";
import {getCustomers} from "../services/customers.ts";
import {getCustomerProducts} from "../services/products.ts";
import {customerColumns, customerSearchProps, productColumns, productSearchProps} from "../utils/constants.ts";
import {ICustomer, IProduct} from "../utils/types.ts";
import {externalLink, userIcon} from "../assets/icons/icons.ts";
import Modal from "../components/modal/modal.vue";
import DataTable from "../components/table/DataTable.vue";

const customers = ref<ICustomer[]>([]);
const products = ref<IProduct[]>([]);
const visible = ref<boolean>(false);
const selectedCustomer = ref<ICustomer | undefined>();
const loadingCustomerData = ref<boolean>(false);

const customerTableData = computed(() => {
  return customers.value.map((customer) => {
    return {
      ...customer,
      docNum: `${customer.docNum} (${customer.docType.toUpperCase()})`,
      action: {
        actionText: 'Obrir',
        actionIcon: externalLink,
        action: () => toggleModal(customer.customerId)
      }
    };
  });
});

const loadCustomerData = async () => {
  try{
    loadingCustomerData.value = true;
    await getCustomers().then((data) => {
      customers.value = data;
    });
  } catch (error) {
    console.error(error);
  }finally {
    loadingCustomerData.value = false;
  }
};

const loadCustomerProducts = async () => {
  if(!selectedCustomer.value) return;
  try{
    await getCustomerProducts(selectedCustomer.value.customerId).then((data) => {
      products.value = data;
    });
  } catch (error) {
    console.error(error);
  }
};

const toggleModal = (customerId: string) => {
  if(!customerId) {
    loadCustomerProducts();
    visible.value = !visible.value;
    return;
  }
  selectedCustomer.value = customers.value.find((customer) => customer.customerId === customerId);
  visible.value = !visible.value;
};

onMounted(() => {
  loadCustomerData();
});

</script>

<template>
  <Modal
      :visible="visible"
      @toggle="toggleModal"
  >
    <template v-slot:header>
      <div class="modal-header">
        <span v-html="userIcon"></span>
        <h2>
          {{selectedCustomer?.givenName}}
        </h2>
      </div>

    </template>
    <template v-slot:body>
      <div class="customer-info-container">
        <div class="customer-info-item">
          <label for="givenName">Nom:</label>
          <span id="givenName" >{{selectedCustomer?.givenName}} </span>

          <label for="email">Email:</label>
          <span id="email" >{{selectedCustomer?.email}} </span>

          <label for="docType">Tipus de document:</label>
          <span id="docType" >{{selectedCustomer?.docType.toUpperCase()}} </span>
        </div>
        <div class="customer-info-item">
          <label for="familyName">Cognom:</label>
          <span id="familyName" >{{selectedCustomer?.familyName1}} </span>

          <label for="phone">Teléfon:</label>
          <span id="phone" >{{selectedCustomer?.phone}} </span>

          <label for="docNum">Numero de document:</label>
          <span id="docNum" >{{selectedCustomer?.docNum}} </span>
        </div>
      </div>
      <hr/>
      <span style="font-weight: bold;">Productes contractats</span>
      <DataTable
          :items="products"
          :columns="productColumns"
          :search-props="productSearchProps"
          search
      >
        <template v-slot:not-found>
          <p>No s'han trobat productes</p>
        </template>
      </DataTable>
    </template>
  </Modal>
  <div class="customer-container">
    <h1>Clients</h1>
    <DataTable
        :items="customerTableData"
        :columns="customerColumns"
        :search-props="customerSearchProps"
        :action="true"
        search
        @toggle="toggleModal"
    >
      <template v-slot:not-found>
        <p>{{ loadingCustomerData ? 'Carregant dades...' : 'No s\'han trobat clients'}}</p>
      </template>
    </DataTable>
  </div>

</template>

<style scoped>
.customer-container {
  align-items: center;
  padding: 20px;
  width: 80%;
}
.customer-info-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px;
}
.customer-info-item {
  width: 50%;
  display: flex;
  flex-direction: column;
}
label {
  font-weight: bold;
}
hr {
  height: 2px;
  background-color: #aaaaaa;
  border: none;
  margin: 20px 0;
}
.modal-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
</style>
