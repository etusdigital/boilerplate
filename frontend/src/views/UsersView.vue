<template>
  <Transition name="page" mode="out-in">
    <div>
      <h1 class="core-app-title">Users</h1>
        <b-table
          :headers="tcolumns"
          :items="tdata"
          :options="{'sortBy': 'name', 'sortDesc': false}"
          :loading="isLoading"
          :itemsPerPage="itemsPerPage"
          v-model:page="page"
          v-model:items-per-page="itemsPerPage"
        >
          <template
              v-for="(metric, index) in tcolumns"
              v-slot:[metric.value]="{ item }"
          >
              <td
                  v-if="item && metric.value"
                  :key="`child-${index}-${item.value}`"
              >
              {{ item[metric.value] }}
              </td>
          </template>
          <template v-slot:actions="{ item }">
              <td>
                  <div class="flex justify-center gap-4">
                      <b-icon name="edit" class="table-action edit" @click="onEdit(item)" />
                      <b-icon name="delete" class="table-action delete" @click="onDelete(item)" />
                  </div>
              </td>
          </template>
          <template #items-per-page>Items per page</template>
          <template #showing-page="{ min, max, total }">
              {{ `Showing ${min} to ${max} of ${total}` }}
          </template>
        </b-table>
        <UserForm />
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import UserForm from '@/components/UserForm.vue';

  const isLoading = false;
  const itemsPerPage = ref(10);
  const page = ref(1);
  const tcolumns = ref([
    {
        "text": "Name",
        "label": "Name",
        "value": "name",
        "sortable": true,
        "width": "50%"
    },
    {
        "text": "Email",
        "label": "Email",
        "value": "email",
        "sortable": true,
    },
    {
        "text": "Join Date",
        "label": "Join Date",
        "value": "created_at",
        "sortable": true,
    },
    {
        "text": "End Date",
        "label": "End Date",
        "value": "deleted_at",
        "sortable": true,
    }
]);

const tdata = ref([
  {
    name: 'Rafael',
    email: 'rafael@brius.com.br',
    created_at: '2025-03-21',
    deleted_at: null
  },
  {
    name: 'Marcos',
    email: 'marcos@brius.com.br',
    created_at: '2025-03-22',
    deleted_at: null
  },
  {
    name: 'Matheus',
    email: 'matheus@brius.com.br',
    created_at: '2025-03-23',
    deleted_at: null
  }
]);

const onEdit = (val: any) => {
  console.log('editing', val);
} 

const onDelete = (val: any) => {
  console.log('editing', val);
}

const sert = (v: any) => {
  console.log('v', v)
}
</script>

<style>
.form-card {
  padding: 2rem;
}
</style>