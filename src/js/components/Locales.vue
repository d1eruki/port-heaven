<template>
  <div id="app">
    <h1>{{ $t('welcome') }}</h1>
    <p>{{ $t('description') }}</p>
    <button @click="changeLanguage">
      {{ $t('changeLanguage') }}
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    changeLanguage() {
      const newLang = this.$i18n.locale === 'en' ? 'ru' : 'en';
      this.$i18n.locale = newLang;
    },
  },
};
</script>
