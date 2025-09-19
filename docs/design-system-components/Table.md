# Name: Table
## Component Overview

**Purpose**: A comprehensive data table component with sorting, pagination, selection, loading states, and extensive customization through slots for displaying structured data.

**Import**: Automatic - no need to import any DS components

### Basic Usage

```vue
<template>
    <Table :columns="columns" :data="data">
        <template v-for="header in columns" v-slot:[header.value]="{ item, index }">
            <td>{{ item[header.value] }}</td>
        </template>

        <template #actions>
            <td class="flex items-center justify-end">
                <Button color="primary" variant="plain" icon="more_vert" round />
            </td>
        </template>
    </Table>
</template>

<script setup lang="ts">
const columns = [
    { label: "Name", value: "name", sortable: true },
    { label: "Age", value: "age", sortable: true },
    { label: "Membership", value: "membership" }
]

const data = [
    { name: "Joanna", age: 43, memberShip: "Platinum" },
    { name: "Jhonny", age: 23, memberShip: "Gold" },
    ...
]
</script>
```

---

### Props API

#### columns
Array of column columns defining table structure. Type: `Column[]` (required)

```typescript
type Column = {
  label?: string;     // Display text for column
  value: string;      // Property key from column
  sortable?: boolean; // Enable sorting for this column
  width?: string;     // CSS width value
  align?: string;     // Text alignment: 'left', 'center', 'right'
}
```

#### data
Array of data objects to display in table items. Type: `any[]` (required)

#### sortOptions
Configuration object for sorting settings. Type: `Options` (optional)

```typescript
type Options = {
  by?: string;    // Initial column to sort by
  desc?: boolean; // Initial sort direction (true = descending)
}
```

#### page
Current active page number. Type: `number` (default: `1`)

```vue
<template>
    <Table :columns="columns" :data="data" v-model:page="currentPage" @update:page="handlePageChange">
        ...
    </Table>
</template>

<script setup lang="ts">

const currentPage = ref(1)

const handlePageChange = (newPage: number) => {}
</script>
```

#### items-per-page
Number of items to display per page. Type: `number` (default: `10`)

```vue
<template>
    <Table 
        :columns="columns" 
        :items="items"
        v-model:items-per-page="itemsPerPage"
        @update:items-per-page="handleitemsPerPageChange"
    >
        ...
    </Table>
</template>

<script setup lang="ts">

const itemsPerPage = ref(20)

const handleitemsPerPageChange = (newitemsPerPage: number) => {}
</script>
```

#### loading
Shows skeleton loading animation. Type: `boolean` (default: `false`)

#### enable-selection
Enables row selection with checkboxes. Type: `boolean` (default: `false`)

```vue
<template>
    <Table :columns="columns" :items="items" enable-selection @select-all="handleSelectAll">
        <template #select="{ item }">
            <td>
                <Checkbox v-model="item.selected" />
            </td>
        </template>
        ...
    </Table>
</template>

<script setup lang="ts">
const handleSelectAll = (selected: any) => {}
</script>
```

#### enable-aggregation
Enables expandable items for nested data. Type: `boolean` (default: `false`)

```vue
<template>
    <Table :columns="columns" :items="items" enable-aggregation>
        <template #aggregation="{ item }">
            <div class="flex items-center justify-center p-xxs rounded-full cursor-pointer hover:bg-neutral-surface-highlight">
                <icon
                    name="arrow_drop_down"
                    class="transition-transform"
                    :class="{ 'rotate-180': item.expanded }"
                    @click="item.expanded = !item.expanded"
                />
            </div>
        </template>
        ...
        <template #childs="{ item }">
            <tr v-if="item.expanded" v-for="child in item.children" :key="child.id">
                <td></td>
                <td>{{ child.name }}</td>
                <td>{{ child.value }}</td>
            </tr>
        </template>
    </Table>
</template>
```

#### is-header-fixed
Makes header sticky during vertical scroll. Type: `boolean` (default: `false`)

#### has-hover
Enables row hover effects. Type: `boolean` (default: `false`)

#### hide-footer
Hides pagination footer. Type: `boolean` (default: `false`)

#### no-shadow
Removes the default shadow from the table card container. Type: `boolean` (default: `false`)

#### number-of-items
Total number of items across all pages (used for backend pagination). Type: `number` (default: `0`)

```vue
<template>
    <Table 
        :columns="columns" 
        :items="currentPageItems"
        :render-pagination-in-back-end="true"
        :number-of-items="totalOptions"
        @page-items="handlePageChange"
        @sort-by="handleSort"
      >
        ...
    </Table>
</template>

<script setup lang="ts">
const handlePageChange = (page: number, itemsPerPage: number) => {}

const handleSort = (key: string, isDesc: boolean) => {}
</script>
```

#### render-pagination-in-back-end
Enables backend pagination mode. Type: `boolean` (default: `false`)

---

### Events API

#### update:page
Emitted when the current page changes (v-model:page). Receives the new page number.

#### update:items-per-page
Emitted when the items per page selection changes (v-model:items-per-page). Receives the new items per page count.

#### @sort-by
Triggered when a column header is clicked for sorting.

#### @page-items
Triggered when pagination changes (page or items per page).

#### @select-all
Triggered when the "select all" checkbox is toggled.

---

### Slots API

#### Dynamic Column Slots (`#{header.value}`)
For each header, a slot is created with the header's `value` as the slot name.

```vue
<template>
    <Table :columns="columns" :items="items">
        <template v-for="header in columns" v-slot:[header.value]="{ item, index }">
            <td>{{ item[header.value] }}</td>
        </template>
    </Table>
</template>
```

#### #actions
Displays action buttons or controls for each row.

```vue
<template>
    <Table :columns="columns" :items="items">
        ...
        <template #actions="{ item }">
            <td class="flex items-center justify-end">
                <Button
                    color="primary"
                    variant="plain"
                    icon="more_vert"
                    round
                    @click="() => handleActions(item)"
                />
            </td>
        </template>
    </Table>
</template>

<script setup lang="ts">
const handleActions = (item) => {}
</script>
```

#### #select
Custom selection controls when `enableSelection` is true.

#### #aggregation
Expand/collapse controls when `enableAggregation` is true.

#### #childs
Renders nested/child items when parent row is expanded.

#### #empty-state
Displayed when no data are available.

```vue
<template>
    <Table :columns="columns" :data="data">
          <template #empty-state>
              <div class="flex items-center justify-center p-xxs rounded-full text-xl">
                  <Icon name="sentiment_dissatisfied" size="1em" />
              </div>
          </template>
      </Table>
</template>
```

#### #footer
Custom table footer content.

#### #items-per-page
Custom text for pagination controls.

#### #showing-page
Custom pagination info text.

**Important Notes:**
- The table automatically handles sorting, pagination, and selection when not in backend mode
- Slot parameters provide access to `item` (row data) and `index` (row number)
- Use `renderPaginationInBackEnd` for large datasets with server-side pagination