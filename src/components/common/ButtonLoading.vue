<template>

    <button :type="type" :disabled="loading || disabled" @click="$emit('click')" :class="[
        buttonClass,
        (loading || disabled)
            ? 'opacity-60 cursor-not-allowed'
            : ''
    ]">

        <div class="flex items-center justify-center gap-2">

            <!-- Spinner -->
            <svg v-if="loading" class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">

                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />

                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4A10 10 0 002 12h2z" />

            </svg>

            <span>

                {{ loading ? loadingText : text }}

            </span>

        </div>

    </button>

</template>

<script setup>

defineProps({

    text: {
        type: String,
        default: 'Save'
    },

    loadingText: {
        type: String,
        default: 'Saving...'
    },

    loading: {
        type: Boolean,
        default: false
    },

    disabled: {
        type: Boolean,
        default: false
    },

    type: {
        type: String,
        default: 'button'
    },

    buttonClass: {
        type: String,
        default:
            'rounded bg-primary px-5 py-2 text-white'
    }

})

defineEmits([
    'click'
])

</script>