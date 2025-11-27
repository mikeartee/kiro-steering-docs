---
title: Vue.js Component Patterns
description: Guides Kiro to write Vue components following modern Composition API and best practices
category: frameworks
tags:
  - vue
  - components
  - composition-api
  - typescript
  - patterns
  - react
  - best-practices
inclusion: always
applicableTo:
  - web-app
  - library
requiredDependencies:
  - react
  - vue
filePatterns:
  - components/**/*.jsx
  - components/**/*.tsx
  - src/components/**/*
  - components/**/*.vue
  - src/components/**/*.vue
version: 1.0.0
---

## Core Principle

**Kiro writes clean, maintainable Vue components using the Composition API and modern Vue 3 patterns.** This steering document ensures components are well-structured, properly typed, and follow Vue conventions.

## How Kiro Will Write Vue Components

### Component Structure with Composition API

**Consistent organization**: Components follow script setup pattern

```vue
<!-- Kiro will write: -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { User } from '@/types/user';

interface Props {
  userId: string;
  showDetails?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: true
});

const emit = defineEmits<{
  update: [user: User];
  delete: [userId: string];
}>();

const user = ref<User | null>(null);
const isLoading = ref(true);

const displayName = computed(() => {
  return user.value ? `${user.value.firstName} ${user.value.lastName}` : '';
});

const fetchUser = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(`/api/users/${props.userId}`);
    user.value = await response.json();
  } finally {
    isLoading.value = false;
  }
};

const handleUpdate = () => {
  if (user.value) {
    emit('update', user.value);
  }
};

onMounted(() => {
  fetchUser();
});
</script>

<template>
  <div class="user-profile">
    <div v-if="isLoading" class="loading">Loading...</div>
    <div v-else-if="user" class="user-content">
      <h2>{{ displayName }}</h2>
      <p v-if="showDetails">{{ user.email }}</p>
      <button @click="handleUpdate">Update</button>
    </div>
    <div v-else class="error">User not found</div>
  </div>
</template>

<style scoped>
.user-profile {
  padding: 1rem;
}

.loading {
  color: #666;
}
</style>

<!-- Not: -->
<script>
export default {
  props: ['userId', 'showDetails'],
  data() {
    return {
      user: null,
      isLoading: true
    };
  },
  computed: {
    displayName() {
      return this.user ? `${this.user.firstName} ${this.user.lastName}` : '';
    }
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      this.isLoading = true;
      const response = await fetch(`/api/users/${this.userId}`);
      this.user = await response.json();
      this.isLoading = false;
    }
  }
};
</script>
```

### Props Definition

**Clear prop types**: TypeScript interfaces for props with defaults

```vue
<!-- Kiro will write: -->
<script setup lang="ts">
interface Props {
  title: string;
  count?: number;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  variant: 'primary',
  disabled: false
});
</script>

<template>
  <div :class="`card card-${variant}`">
    <h3>{{ title }}</h3>
    <span class="count">{{ count }}</span>
  </div>
</template>

<!-- Not: -->
<script>
export default {
  props: {
    title: String,
    count: Number,
    variant: String,
    disabled: Boolean
  }
};
</script>
```

### Reactive State with ref and reactive

**Descriptive state names**: Clear naming for reactive variables

```vue
<!-- Kiro will write: -->
<script setup lang="ts">
import { ref, reactive } from 'vue';

const searchQuery = ref('');
const searchResults = ref<Result[]>([]);
const isSearching = ref(false);

const formData = reactive({
  email: '',
  password: '',
  rememberMe: false
});

const handleSearch = async () => {
  isSearching.value = true;
  try {
    const results = await searchAPI(searchQuery.value);
    searchResults.value = results;
  } finally {
    isSearching.value = false;
  }
};
</script>

<template>
  <div class="search-form">
    <input v-model="searchQuery" placeholder="Search..." />
    <button @click="handleSearch" :disabled="isSearching">
      {{ isSearching ? 'Searching...' : 'Search' }}
    </button>
    <ul v-if="searchResults.length">
      <li v-for="result in searchResults" :key="result.id">
        {{ result.title }}
      </li>
    </ul>
  </div>
</template>

<!-- Not: -->
<script setup>
const query = ref('');
const results = ref([]);
const loading = ref(false);

const search = async () => {
  loading.value = true;
  results.value = await searchAPI(query.value);
  loading.value = false;
};
</script>
```

### Computed Properties

**Clear computed logic**: Derived state with proper typing

```vue
<!-- Kiro will write: -->
<script setup lang="ts">
import { ref, computed } from 'vue';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const cartItems = ref<CartItem[]>([]);

const totalItems = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
});

const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const formattedTotal = computed(() => {
  return `$${totalPrice.value.toFixed(2)}`;
});
</script>

<template>
  <div class="cart-summary">
    <p>Items: {{ totalItems }}</p>
    <p>Total: {{ formattedTotal }}</p>
  </div>
</template>

<!-- Not: -->
<script setup>
const cartItems = ref([]);

const total = computed(() => {
  let sum = 0;
  for (let i = 0; i < cartItems.value.length; i++) {
    sum += cartItems.value[i].price * cartItems.value[i].quantity;
  }
  return '$' + sum.toFixed(2);
});
</script>
```

### Lifecycle Hooks

**Proper lifecycle management**: Clear setup and cleanup

```vue
<!-- Kiro will write: -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const activityLog = ref<Activity[]>([]);
let subscription: Subscription | null = null;

const subscribeToActivity = (userId: string) => {
  subscription = activityStream.subscribe(userId, (activity) => {
    activityLog.value.push(activity);
  });
};

const unsubscribeFromActivity = () => {
  if (subscription) {
    subscription.unsubscribe();
    subscription = null;
  }
};

onMounted(() => {
  subscribeToActivity(props.userId);
});

onUnmounted(() => {
  unsubscribeFromActivity();
});

watch(() => props.userId, (newUserId, oldUserId) => {
  if (newUserId !== oldUserId) {
    unsubscribeFromActivity();
    subscribeToActivity(newUserId);
  }
});
</script>

<!-- Not: -->
<script setup>
const activityLog = ref([]);

onMounted(() => {
  activityStream.subscribe(props.userId, (activity) => {
    activityLog.value.push(activity);
  });
});
// Missing cleanup
</script>
```

### Composables (Custom Hooks)

**Reusable logic**: Extract common patterns into composables

```typescript
// Kiro will write:
// composables/useApi.ts
import { ref, type Ref } from 'vue';

interface UseApiReturn<T> {
  data: Ref<T | null>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
  refetch: () => Promise<void>;
}

export function useApi<T>(url: string): UseApiReturn<T> {
  const data = ref<T | null>(null);
  const isLoading = ref(true);
  const error = ref<Error | null>(null);

  const fetchData = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      data.value = await response.json();
    } catch (err) {
      error.value = err as Error;
    } finally {
      isLoading.value = false;
    }
  };

  fetchData();

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  };
}

// Usage:
<script setup lang="ts">
import { useApi } from '@/composables/useApi';
import type { User } from '@/types/user';

const { data: users, isLoading, error } = useApi<User[]>('/api/users');
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <ul v-else>
    <li v-for="user in users" :key="user.id">{{ user.name }}</li>
  </ul>
</template>

// Not:
<script setup>
const users = ref([]);
const loading = ref(true);

onMounted(async () => {
  const response = await fetch('/api/users');
  users.value = await response.json();
  loading.value = false;
});
</script>
```

### Event Handling

**Consistent naming**: Use handle prefix for event handlers

```vue
<!-- Kiro will write: -->
<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const isSubmitting = ref(false);

const handleEmailChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  email.value = target.value;
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;
  
  isSubmitting.value = true;
  try {
    await login(email.value, password.value);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input 
      type="email" 
      :value="email" 
      @input="handleEmailChange"
    />
    <input 
      type="password" 
      v-model="password"
    />
    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Logging in...' : 'Login' }}
    </button>
  </form>
</template>

<!-- Not: -->
<script setup>
const email = ref('');
const password = ref('');

const submit = async () => {
  await login(email.value, password.value);
};
</script>

<template>
  <form @submit.prevent="submit">
    <input type="email" v-model="email" />
    <input type="password" v-model="password" />
    <button type="submit">Login</button>
  </form>
</template>
```

### Component Composition

**Small, focused components**: Break down complex UIs

```vue
<!-- Kiro will write: -->
<!-- Card.vue -->
<script setup lang="ts">
interface Props {
  variant?: 'default' | 'elevated' | 'outlined';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
});
</script>

<template>
  <div :class="`card card-${variant}`">
    <slot />
  </div>
</template>

<!-- CardHeader.vue -->
<template>
  <div class="card-header">
    <slot />
  </div>
</template>

<!-- CardBody.vue -->
<template>
  <div class="card-body">
    <slot />
  </div>
</template>

<!-- Usage: UserCard.vue -->
<script setup lang="ts">
import Card from '@/components/Card.vue';
import CardHeader from '@/components/CardHeader.vue';
import CardBody from '@/components/CardBody.vue';
import type { User } from '@/types/user';

interface Props {
  user: User;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  edit: [userId: string];
}>();

const handleEdit = () => {
  emit('edit', props.user.id);
};
</script>

<template>
  <Card variant="elevated">
    <CardHeader>
      <h3>{{ user.name }}</h3>
    </CardHeader>
    <CardBody>
      <p>{{ user.email }}</p>
      <p>{{ user.bio }}</p>
      <button @click="handleEdit">Edit</button>
    </CardBody>
  </Card>
</template>

<!-- Not: -->
<template>
  <div class="card">
    <div class="card-header">
      <h3>{{ user.name }}</h3>
    </div>
    <div class="card-body">
      <p>{{ user.email }}</p>
      <p>{{ user.bio }}</p>
      <button @click="$emit('edit', user.id)">Edit</button>
    </div>
  </div>
</template>
```

## What This Prevents

- **Options API confusion** by using modern Composition API
- **Type errors** with TypeScript integration
- **Memory leaks** from missing cleanup in lifecycle hooks
- **Prop drilling** through proper component composition
- **Inconsistent patterns** across components
- **Hard-to-test components** from poor separation of concerns

## Simple Examples

### Before/After: Data Fetching Component

```vue
<!-- Before: -->
<script>
export default {
  props: ['userId'],
  data() {
    return {
      user: null,
      posts: [],
      loading: true
    };
  },
  mounted() {
    fetch(`/api/users/${this.userId}`).then(r => r.json()).then(u => this.user = u);
    fetch(`/api/users/${this.userId}/posts`).then(r => r.json()).then(p => this.posts = p);
    this.loading = false;
  },
  template: `
    <div v-if="loading">Loading...</div>
    <div v-else>
      <h1>{{ user.name }}</h1>
      <div v-for="post in posts" :key="post.id">{{ post.title }}</div>
    </div>
  `
};
</script>

<!-- After: -->
<script setup lang="ts">
import { useApi } from '@/composables/useApi';
import UserHeader from '@/components/UserHeader.vue';
import PostList from '@/components/PostList.vue';
import type { User, Post } from '@/types';

interface Props {
  userId: string;
}

const props = defineProps<Props>();

const { data: user, isLoading: isLoadingUser } = useApi<User>(`/api/users/${props.userId}`);
const { data: posts, isLoading: isLoadingPosts } = useApi<Post[]>(`/api/users/${props.userId}/posts`);

const isLoading = computed(() => isLoadingUser.value || isLoadingPosts.value);
</script>

<template>
  <div class="user-dashboard">
    <div v-if="isLoading" class="loading">
      <LoadingSpinner />
    </div>
    <div v-else-if="user" class="content">
      <UserHeader :user="user" />
      <PostList :posts="posts || []" />
    </div>
    <div v-else class="error">
      User not found
    </div>
  </div>
</template>

<style scoped>
.user-dashboard {
  padding: 1rem;
}
</style>
```

## Customization

This is a starting point for Vue component patterns. You can customize by:

- Adding state management patterns (Pinia, Vuex)
- Including routing conventions (Vue Router)
- Adding form handling patterns (VeeValidate)
- Incorporating testing patterns (Vue Test Utils)

## Related Documents

- [TypeScript Formatting](../../code-formatting/typescript-formatting.md) - TypeScript conventions
- [JavaScript Formatting](../../code-formatting/javascript-formatting.md) - JavaScript style

## Optional: Validation with External Tools

Want to enforce these patterns automatically? Consider these tools:

### Vue Development Tools (Optional)

```bash
# ESLint with Vue plugin
npm install --save-dev eslint eslint-plugin-vue

# TypeScript for type checking
npm install --save-dev typescript vue-tsc

# Vue Test Utils
npm install --save-dev @vue/test-utils vitest
```

**Note**: These tools help enforce patterns but aren't required for the steering document to work.
