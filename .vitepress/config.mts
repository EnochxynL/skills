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
          { text: 'Ubuntu 24.04', link: '/ubuntu/skill' },
          { text: 'Podman', link: '/podman/skill' },
          { text: 'Wine', link: '/wine/skill' },
        ],
      },
      {
        text: '编程语言',
        collapsed: false,
        items: [
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
            text: 'C++ 嵌入式',
            items: [
              { text: 'PlatformIO', link: '/cpp-pio/skill' },
            ],
          },
          {
            text: 'Python',
            items: [
              { text: 'Python', link: '/python/skill' },
              { text: 'Python UV', link: '/python-uv/skill' },
              { text: 'Python Conda', link: '/python-conda/skill' },
            ],
          },
          {
            text: 'Node.js',
            items: [
              { text: 'pnpm', link: '/nodejs-pnpm/skill' },
            ],
          },
        ],
      },
      {
        text: '软件框架',
        items: [
          { text: 'ROS 1', link: '/ros1/skill' },
          { text: 'ROS 2', link: '/ros2/skill' },
        ],
      },
      {
        text: '项目管理',
        items: [
          { text: 'Hermes', link: '/hermes/skill' },
          { text: 'WandB', link: '/wandb/skill' },
          { text: 'v2rayA', link: '/v2raya/skill' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/EnochxynL/skills' },
    ],
  },
})
