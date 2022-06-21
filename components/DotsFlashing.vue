<template>
  <div class="dots">
    <div
      class="snippet"
      data-title=".dot-flashing"
    >
      <div class="stage">
        <div class="dot-flashing" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DotsFlashing',
};
</script>

<style scoped lang="scss">

.dots {
  width: fit-content;
  margin-right: 20px;
}
.dot-flashing {
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: $blue;
  color: $blue;
  animation: dotFlashing 1s infinite linear alternate;
  animation-delay: .5s;
}

.dot-flashing::before, .dot-flashing::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
}

.dot-flashing::before {
  left: -25px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: $blue;
  color: $blue;
  animation: dotFlashing 1s infinite alternate;
  animation-delay: 0s;
}

.dot-flashing::after {
  left: 25px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: $blue;
  color: $blue;
  animation: dotFlashing 1s infinite alternate;
  animation-delay: 1s;
}

@keyframes dotFlashing {
  0% {
    background-color: $blue;
  }
  50%,
  100% {
    background-color: $blue100;
  }
}
</style>
