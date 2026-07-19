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
        text: '基础环境',
        items: [
          { text: 'Ubuntu 24.04', link: '/ubuntu/skill' },
          { text: 'Podman', link: '/podman/skill' },
          { text: 'Wine', link: '/wine/skill' },
        ],
      },
      {
        text: 'Python',
        items: [
          { text: 'Python 故障排查', link: '/python/skill' },
          { text: 'Python UV', link: '/python-uv/skill' },
          { text: 'Python Conda', link: '/python-conda/skill' },
        ],
      },
      {
        text: 'C++ 编译器',
        items: [
          { text: 'MSVC', link: '/cpp-msvc/skill' },
          { text: 'GNU', link: '/cpp-gnu/skill' },
          { text: 'MSYS2', link: '/cpp-msys2/skill' },
        ],
      },
      {
        text: 'C++ 构建与包管理',
        items: [
          { text: 'CMake', link: '/cpp-cmake/skill' },
          { text: 'Conan', link: '/cpp-conan/skill' },
          { text: 'vcpkg', link: '/cpp-vcpkg/skill' },
        ],
      },
      {
        text: '嵌入式',
        items: [
          { text: 'PlatformIO', link: '/cpp-pio/skill' },
        ],
      },
      {
        text: 'ROS',
        items: [
          { text: 'ROS 1', link: '/ros1/skill' },
          { text: 'ROS 2', link: '/ros2/skill' },
        ],
      },
      {
        text: 'Node.js',
        items: [
          { text: 'pnpm', link: '/nodejs-pnpm/skill' },
        ],
      },
      {
        text: '工具',
        items: [
          { text: 'v2rayA', link: '/v2raya/skill' },
          { text: 'WandB', link: '/wandb/skill' },
          { text: 'Hermes', link: '/hermes/skill' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/EnochxynL/skills' },
    ],
  },
})
