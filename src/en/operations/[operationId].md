---
aside: false
outline: false
---

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'
import spec from '../openapi.json'

const route = useRoute()

const { isDark } = useData()

const operationId = route.data.params.operationId
</script>

<OAOperation :spec="spec" :operationId="operationId" :isDark="isDark"></OAOperation>
