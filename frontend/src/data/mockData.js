export const demoScenarios = [
  {
    id: 'demo-backend',
    title: 'Java后端实习生',
    desc: '互联网中厂后端实习岗',
    jd: `【岗位】Java后端开发实习生
【要求】
1. 计算机相关专业，本科及以上学历
2. 熟悉Java编程，了解Spring Boot框架
3. 熟悉MySQL数据库，能编写SQL语句
4. 了解Redis、消息队列等中间件者优先
5. 有实际项目经验者优先
6. 良好的沟通能力和团队协作精神`,
    resume: `【个人信息】张三 | 软件工程大三 | 某211高校
【技能】Java基础、MySQL、数据结构
【项目】校园二手交易平台（课程设计）：使用Java+MySQL实现商品发布和搜索功能
【其他】参加了学校编程社团，无实习经历`
  },
  {
    id: 'demo-product',
    title: 'AI产品实习生',
    desc: 'AI赛道产品实习岗',
    jd: `【岗位】AI产品经理实习生
【要求】
1. 对AI/大模型产品有强烈兴趣和基本认知
2. 具备用户调研和需求分析能力
3. 能独立撰写PRD，逻辑清晰
4. 有数据分析基础，会SQL加分
5. 有产品实习或项目经验者优先
6. 学习能力强，关注AI行业动态`,
    resume: `【个人信息】李四 | 信息管理大三 | 某985高校
【技能】Axure、XMind、基础SQL
【项目】校园外卖小程序产品设计（课程作业）：做了用户调研和原型设计
【其他】运营过个人公众号（300粉），无产品实习经历`
  },
  {
    id: 'demo-operation',
    title: '新媒体运营实习生',
    desc: '互联网公司运营实习岗',
    jd: `【岗位】新媒体运营实习生
【要求】
1. 熟悉主流内容平台（小红书/抖音/公众号）的规则与玩法
2. 有内容策划和文案撰写能力
3. 会基础的数据分析，能从数据中找到优化点
4. 有社群运营或用户运营经验优先
5. 审美好，会PS/Canva加分
6. 自驱力强，善于捕捉热点`,
    resume: `【个人信息】王五 | 市场营销大三 | 某双非一本
【技能】公众号排版、基础PS
【项目】曾在学校学生会负责公众号运营（一学期发了20篇推文）
【其他】喜欢刷小红书和抖音，自己偶尔发但没认真运营过`
  }
]

export const mockReportData = {
  id: 'report-demo-backend',
  scenarioId: 'demo-backend',
  timestamp: '2026-05-19',
  matchScore: 47,
  dimensions: [
    { label: '硬技能', score: 40, fullMark: 100 },
    { label: '软技能', score: 60, fullMark: 100 },
    { label: '项目经历', score: 30, fullMark: 100 },
    { label: '学历匹配', score: 80, fullMark: 100 },
    { label: '领域知识', score: 25, fullMark: 100 },
  ],
  criticalGaps: [
    {
      id: 'gap-1',
      severity: 'critical',
      dimension: '硬技能',
      title: 'Spring Boot 框架经验缺失',
      description: 'JD明确要求"了解Spring Boot框架"，但你的简历中未体现任何Spring Boot相关的学习或使用经历。这是后端开发实习生的核心门槛，面试官会直接考察。',
      jdRequirement: '熟悉Spring Boot框架',
      resumeEvidence: '未发现相关证据'
    }
  ],
  importantGaps: [
    {
      id: 'gap-2',
      severity: 'important',
      dimension: '硬技能',
      title: '缺少 Redis / 消息队列 等中间件认知',
      description: 'JD将Redis和消息队列列为"优先"加分项，说明团队实际技术栈依赖这些组件。目前你的简历中没有任何中间件相关经历，这会让你在与其他候选人的比较中处于劣势。',
      jdRequirement: '了解Redis、消息队列等中间件者优先',
      resumeEvidence: '未发现相关证据'
    },
    {
      id: 'gap-3',
      severity: 'important',
      dimension: '项目经历',
      title: '缺乏实际生产级项目经验',
      description: '你的课程设计项目展示了基础的CRUD能力，但JD期望的是"实际项目经验"。课设和真实项目的差距在于：并发处理、异常场景、部署上线、团队协作等维度。',
      jdRequirement: '有实际项目经验者优先',
      resumeEvidence: '仅有课程设计项目，无实习/上线项目'
    },
    {
      id: 'gap-4',
      severity: 'important',
      dimension: '领域知识',
      title: '缺少互联网后端开发场景认知',
      description: 'JD描述的是一个典型的互联网后端岗位，涉及高并发、分布式等场景。你目前的项目经验停留在单机单体应用层面，对互联网后端的技术全貌缺乏了解。',
      jdRequirement: '隐含的互联网后端技术栈要求',
      resumeEvidence: '项目为单体应用，无分布式/并发相关经历'
    }
  ],
  advantages: [
    {
      id: 'adv-1',
      severity: 'match',
      dimension: '硬技能',
      title: 'Java 和 MySQL 基础扎实',
      description: 'JD要求的核心语言和数据库你已具备基础能力，这是后端开发的基石。'
    },
    {
      id: 'adv-2',
      severity: 'match',
      dimension: '学历匹配',
      title: '软件工程专业背景匹配',
      description: '211高校软件工程专业在读，符合JD的"计算机相关专业、本科及以上"硬门槛。'
    },
    {
      id: 'adv-3',
      severity: 'match',
      dimension: '硬技能',
      title: '有基础项目开发经验',
      description: '虽然只是课设级别，但你已经完成了一个前后端联动的完整项目，具备基本的开发流程认知。'
    },
    {
      id: 'adv-4',
      severity: 'match',
      dimension: '软技能',
      title: '主动参与社团，有团队协作基础',
      description: '编程社团经历表明你有技术社区参与意愿，愿意在课堂外学习和交流。'
    }
  ],
  summary: '你离这个Java后端实习岗位还差一个Spring Boot实战项目 + 一个中间件（Redis/MQ）的学习和项目应用 + 一段可写入简历的上线项目经历。好消息是核心门槛（学历+Java基础）你已满足，接下来用2-4周系统性补上技术和项目缺口，匹配度可从47%提升到75%以上。'
}

export const mockProjectIdeas = [
  // Spring Boot 缺口对应的项目
  {
    id: 'proj-1',
    gapId: 'gap-1',
    gapTitle: 'Spring Boot 框架经验',
    level: 1,
    title: 'RESTful API 服务搭建',
    desc: '用Spring Boot从零搭建一个符合RESTful规范的API服务，掌握Spring Boot核心开发流程。',
    duration: '1-3天',
    skills: ['Java', 'Spring Boot', 'Maven', 'Postman'],
    features: [
      '实现用户注册/登录接口（含参数校验）',
      '实现CRUD接口（以"待办事项"为例）',
      '统一异常处理和响应格式',
      '使用Postman完成接口测试'
    ],
    keywords: 'Spring Boot入门, @RestController, @RequestMapping, application.yml配置, Maven依赖管理',
    resumePhrase: '独立搭建基于Spring Boot的RESTful API服务，实现完整的用户认证与资源CRUD接口，采用统一异常处理与响应体设计'
  },
  {
    id: 'proj-2',
    gapId: 'gap-1',
    gapTitle: 'Spring Boot 框架经验',
    level: 2,
    title: '校园信息服务后端',
    desc: '使用Spring Boot + MyBatis + MySQL开发一个完整的校园信息服务后端，覆盖真实业务场景。',
    duration: '1-2周',
    skills: ['Java', 'Spring Boot', 'MyBatis', 'MySQL', 'JWT'],
    features: [
      '用户系统：注册/登录（JWT认证）、个人信息管理',
      '内容模块：帖子发布/列表分页/搜索/收藏',
      '评论系统：发表评论/回复/删除',
      '数据库设计：3-5张表的关联设计与索引优化'
    ],
    keywords: 'Spring Boot进阶, MyBatis, JWT认证, 分页查询, 数据库设计, RESTful设计',
    resumePhrase: '开发基于Spring Boot+MyBatis的校园信息服务平台后端，实现JWT认证、帖子搜索分页、评论系统等核心功能，设计并优化多表关联查询'
  },
  {
    id: 'proj-3',
    gapId: 'gap-1',
    gapTitle: 'Spring Boot 框架经验',
    level: 3,
    title: '面经分享社区全栈项目',
    desc: '完整的求职面经分享平台：Spring Boot后端 + 缓存 + 文件存储 + 部署上线，一个可以写进简历的深度项目。',
    duration: '3-4周',
    skills: ['Java', 'Spring Boot', 'MyBatis-Plus', 'Redis', 'OSS', 'Docker'],
    features: [
      '用户系统：注册登录、第三方登录（微信/GitHub）',
      '面经发布：富文本编辑器、标签分类、全文搜索',
      '互动：点赞/收藏/评论、热度排序（Redis实现）',
      '文件上传：头像和附件上传到OSS',
      '性能优化：Redis缓存热点数据、接口限流',
      '部署：Docker容器化部署 + Nginx反向代理'
    ],
    keywords: 'Spring Boot企业级开发, Redis缓存, MyBatis-Plus, 全文搜索, Docker部署, OSS文件存储, Nginx',
    resumePhrase: '独立开发面经分享社区全栈项目，采用Spring Boot+Redis+MySQL技术栈，实现用户认证、全文搜索、热度排序、文件存储等核心功能，通过Docker容器化部署上线，全链路自主完成'
  },
  // Redis/中间件缺口对应的项目
  {
    id: 'proj-4',
    gapId: 'gap-2',
    gapTitle: 'Redis / 消息队列',
    level: 1,
    title: 'Redis缓存实战练习',
    desc: '在已有的Spring Boot项目中引入Redis，实现缓存和Session管理，理解Redis核心数据类型和使用场景。',
    duration: '1-2天',
    skills: ['Redis', 'Spring Boot', 'Spring Cache'],
    features: [
      '使用Spring Cache注解实现方法级缓存',
      '用Redis存储用户登录Session',
      '实现一个简单的访问计数器',
      '了解String/Hash/List/Set/ZSet五种数据类型的适用场景'
    ],
    keywords: 'Redis入门, Spring Cache, @Cacheable, Session管理, Redis数据类型',
    resumePhrase: '在Spring Boot项目中集成Redis实现缓存加速，使用Spring Cache注解实现热点数据缓存，有效降低数据库查询压力'
  },
  {
    id: 'proj-5',
    gapId: 'gap-2',
    gapTitle: 'Redis / 消息队列',
    level: 2,
    title: '高并发秒杀系统Demo',
    desc: '实现一个简化的秒杀系统，重点掌握Redis在库存扣减、限流和消息队列在异步下单中的应用。',
    duration: '1-2周',
    skills: ['Java', 'Spring Boot', 'Redis', 'RabbitMQ', 'JMeter'],
    features: [
      '商品秒杀：Redis预减库存 + Lua脚本保证原子性',
      '异步下单：RabbitMQ消息队列削峰填谷',
      '限流保护：Redis实现接口级限流',
      '使用JMeter进行简单压测，对比优化前后效果'
    ],
    keywords: 'Redis分布式锁, Lua脚本, RabbitMQ消息队列, 秒杀设计, 限流算法, JMeter压测',
    resumePhrase: '设计并实现基于Redis+RabbitMQ的高并发秒杀系统，利用Lua脚本保证库存扣减原子性，通过消息队列实现异步下单削峰，经JMeter压测验证可承载1000+并发'
  },
  // 项目经验缺口对应的项目
  {
    id: 'proj-6',
    gapId: 'gap-3',
    gapTitle: '实际生产级项目经验',
    level: 3,
    title: '开源项目贡献实战',
    desc: '选择一个活跃的Java开源项目（如RuoYi/JeecgBoot等快速开发平台），阅读源码、提交PR或基于它做二次开发。这是最接近"真实项目经验"的学习方式。',
    duration: '3-4周',
    skills: ['Java', 'Spring Boot', 'Git协作', '源码阅读', '技术文档'],
    features: [
      '选择一个Star 1k+的开源项目，搭建本地开发环境',
      '阅读核心模块源码（如权限管理/代码生成），输出一篇源码分析笔记',
      '尝试修复一个good first issue 或提交文档改进PR',
      '基于开源框架快速搭建自己的业务应用，体验"真实开发流程"'
    ],
    keywords: '开源协作, Git Flow, 源码阅读方法, PR流程, 技术写作',
    resumePhrase: '深度研读XX开源项目（Star Xk+）核心源码，参与社区贡献并成功提交PR，基于该框架快速交付XX业务应用，掌握企业级开发规范与Git协作流程'
  }
]
