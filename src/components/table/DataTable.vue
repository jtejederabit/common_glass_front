<script setup lang="ts">
import { ref, computed } from 'vue';
import {arrowUp, arrowDown} from "../../assets/icons/icons.ts";

// Definició de les propietats del component
// items: Array d'objectes que es mostraran a la taula
// columns: Array d'objectes amb la definició de les columnes de la taula
//      Exemple: [
//          {key: 'givenName', label: 'Nom', sortable: true},
//      ]
// searchProps: Array amb els noms de les propietats dels objectes que es poden cercar
//      Exemple: ['givenName', 'familyName']
// search: Indica si es mostra el camp per cercar

const props = withDefaults(
    defineProps<{
      items: any[];
      columns: Record<string, any>[];
      searchProps?: string[];
      search?: boolean;
    }>(),
    {
      search: false
    }
);

const search = ref<string>('');
const sortColumn = ref<string>('');
const sortDirection = ref<'asc' | 'desc'>('asc');


// Filtra els items segons el search value i els ordena segons la columna seleccionada
// Només es pot cercar en les propietats indicades a searchProps i els valors han de ser string o number
// Si la columna és sortable, es canvia la direcció de l'ordenació
const filteredItems = computed(() => {
  let items = props.items;

  if (search.value && props.searchProps) {
    items = items.filter(item => {
      return props.searchProps?.some(prop => {
        if (!item[prop]) {
          return false;
        } else if (typeof item[prop] === 'number') {
          return item[prop].toString().includes(search.value);
        } else if (typeof item[prop] === 'string') {
          return item[prop].toLowerCase().includes(search.value.toLowerCase());
        }
        return false;
      });
    });
  }

  if (sortColumn.value) {
    items.sort((curr, next) => {
      const currValue = curr[sortColumn.value];
      const nextValue = next[sortColumn.value];

      if (currValue === nextValue) return 0;

      const comparison = currValue > nextValue ? 1 : -1;

      return sortDirection.value === 'asc' ? comparison : -comparison;
    });
  }

  return items;
});

// Canvia la direcció de l'ordenació si la columna ja està seleccionada
const sort = (column: string) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
};
</script>

<template>
  <div class="dataTable">
    <input v-if="props.search" type="text" placeholder="Cercar..." v-model="search" />
    <table style="width: 100%;">
      <thead>
      <tr>
        <th
            v-for="column in props.columns"
            :key="column.key"
            style="width: 20%;"
            @click="column.sortable && sort(column.key)"
        >
          {{ column.label }}
          <span v-if="column.sortable && sortColumn === column.key">
            <span v-html="sortDirection === 'asc' ? arrowUp : arrowDown"></span>
          </span>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in filteredItems" :key="item._id">
        <td v-for="prop in props.searchProps" :key="prop" class="item-td">{{ item[prop] }}</td>
        <td v-if="item.hasOwnProperty('action')" class="action-button">
          <button @click="item.action.action">
            <span v-if="!item.action.actionIcon">{{item.action.actionText}}</span>
            <span v-else v-html="item.action.actionIcon"></span>
          </button>
        </td>
      </tr>
      </tbody>
    </table>
    <div v-if="!filteredItems.length" class="not-found">
      <slot name="not-found">
        No s'han trobat resultats
      </slot>
    </div>
  </div>
</template>

<style scoped>
.dataTable {
  max-width: 900px;
  min-width: 100%;
  width: 100%;
  margin: 0 auto;
  height: auto;
}

table {
  width: 100%;
  min-width: 100%;
  border-collapse: collapse;
}
th {
  background-color: #f2f2f2;
}
td,
th {
  border: 1px solid rgba(128, 128, 128, 0.29);
}
tr:nth-child(even) {
  background-color: #f2f2f2;
}
input {
  width: 50%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid rgba(128, 128, 128, 0.29);
  border-radius: 5px;
}
.action-button {
  text-align: center;
  padding: 0;
}
.item-td {
  padding: 10px;
}
.not-found {
  text-align: center;
  margin-top: 20px;
}

</style>
