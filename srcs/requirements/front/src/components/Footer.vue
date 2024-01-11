<script>
    export default {
        name: 'Footer'
    }
</script>

<template>
    <footer class="footer p-10 h-100 bg-base-100 text-neutral-content">
        <nav style="text-align: center; align-items: center;">
            <div class="grid grid-flow-col gap-4">
                <a href="https://github.com/Rart3x">
                    <button class="btn btn-ghost btn-circle">
                        <div class="indicator">
                            <img src="../assets/github-svgrepo-com.svg" />
                        </div>
                    </button>
                    <br>
                    <span class="text-sm">Kramjatt</span>
                </a>
                <a href="https://github.com/Centiso">
                    <button class="btn btn-ghost btn-circle">
                        <div class="indicator">
                            <img src="../assets/github-svgrepo-com.svg" />
                        </div>
                    </button>
                    <br>
                    <span class="text-sm">Centiso</span>
                </a>
                <a href="https://github.com/snyk-bot">
                    <button class="btn btn-ghost btn-circle">
                        <div class="indicator">
                            <img src="../assets/github-svgrepo-com.svg" />
                        </div>
                    </button>
                    <br>
                    <span class="text-sm">Nicarpen</span>
                </a>
                <a href="https://github.com/damienglld">
                    <button class="btn btn-ghost btn-circle">
                        <div class="indicator">
                            <img src="../assets/github-svgrepo-com.svg" />
                        </div>
                    </button>
                    <br>
                    <span class="text-sm">Dguillau</span>
                </a>
            </div>
        </nav>
    </footer>
</template>

<style>
    .footer {bottom: 0; left: 0; width: 100%;
        display: flex; justify-content: center; align-items: center; flex-direction: column;
    }
</style>
 