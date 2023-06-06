<script setup lang="ts">

</script>

<template>
  <div class="space-background w-full h-full fixed top-0 left-0"></div>
</template>

<style scoped>
.space-background {
	background-size: 400% 400%;
	animation: gradient 10s ease infinite;

  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: 400% 400%;
    animation: backgroundGradient 10s ease infinite;
  }
}

.space-background,
.light .space-background {
  background-color: theme("colors.yellow.50");
  background-image: linear-gradient(0deg, theme("colors.yellow.100/60") , theme("colors.yellow.50/0"));
  &:before {
    background-image: linear-gradient(120deg, theme("colors.teal.100/60") , theme("colors.teal.50/0"));
  }
  &:after {
    background-image: linear-gradient(240deg, theme("colors.purple.100/60") , theme("colors.purple.50/0"));
  }
}

.dark .space-background {
  background-color: theme("colors.slate.950");
  background-image: linear-gradient(0deg, theme("colors.slate.900/60") , theme("colors.slate.950/0"));

  &:before {
    background-image: linear-gradient(120deg, theme("colors.gray.900/60") , theme("colors.blue.950/0"));
  }
  &:after {
    background-image:linear-gradient(240deg, theme("colors.zinc.900/60") , theme("colors.purple.950/0"));
  }
}

@keyframes backgroundGradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}
</style>
