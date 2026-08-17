import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/skills/',
  title: '安装技巧',
  description: 'Enochxyn\'s Skills',

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: 'GitHub', link: 'https://github.com/EnochxynL/skills' },
    ],

    sidebar: [
      {
        text: '环境容器',
        items: [
          { text: 'Ubuntu 24.04', link: '/environment/ubuntu/skill' },
          { text: 'WSL2', link: '/environment/wsl2/skill' },
          { text: 'Podman', link: '/environment/podman/skill' },
          { text: 'Wine', link: '/environment/wine/skill' },
          { text: 'Windows', link: '/environment/windows/skill' },
        ],
      },
      {
        text: '编程语言',
        collapsed: false,
        items: [
          {
            text: 'C++ 编译器',
            items: [
              { text: 'MSVC', link: '/toolchain/cpp-msvc/skill' },
              { text: 'GNU', link: '/toolchain/cpp-gnu/skill' },
              { text: 'MSYS2', link: '/toolchain/cpp-msys2/skill' },
            ],
          },
          {
            text: 'C++ 构建与包管理',
            items: [
              { text: 'CMake', link: '/toolchain/cpp-cmake/skill' },
              { text: 'Conan', link: '/toolchain/cpp-conan/skill' },
              { text: 'vcpkg', link: '/toolchain/cpp-vcpkg/skill' },
            ],
          },
          {
            text: 'C++ 嵌入式',
            items: [
              { text: 'PlatformIO', link: '/toolchain/cpp-pio/skill' },
              { text: 'STM32', link: '/toolchain/cpp-stm32/skill' },
            ],
          },
          {
            text: 'Rust',
            items: [
              { text: 'Rust', link: '/toolchain/rust/skill' },
            ],
          },
          {
            text: 'Python',
            items: [
              { text: 'Python', link: '/toolchain/python/skill' },
              { text: 'Python UV', link: '/toolchain/python-uv/skill' },
              { text: 'Python Conda', link: '/toolchain/python-conda/skill' },
            ],
          },
          {
            text: 'Node.js',
            items: [
              { text: 'pnpm', link: '/toolchain/nodejs-pnpm/skill' },
            ],
          },
          {
            text: 'Java',
            items: [
              { text: 'Maven', link: '/toolchain/java-maven/skill' },
            ],
          },
          {
            text: 'LaTeX',
            items: [
              { text: 'MiKTeX', link: '/toolchain/latex-miktex/skill' },
            ],
          },
        ],
      },
      {
        text: '软件框架',
        items: [
          { text: 'ROS 1', link: '/framework/ros1/skill' },
          { text: 'ROS 2', link: '/framework/ros2/skill' },
          { text: 'ComfyUI', link: '/framework/comfyui/skill' },
          { text: 'Minecraft', link: '/framework/minecraft/skill' },
        ],
      },
      {
        text: '项目管理',
        items: [
          { text: 'Hermes', link: '/utility/hermes/skill' },
          { text: 'Oh My Pi', link: '/utility/omp/skill' },
          { text: 'WandB', link: '/utility/wandb/skill' },
          { text: 'v2rayA', link: '/utility/v2raya/skill' },
          { text: 'Git', link: '/utility/git/skill' },
          { text: 'VS Code', link: '/utility/vscode/skill' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/EnochxynL/skills' },
    ],
  },
})
