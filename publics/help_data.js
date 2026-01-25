class RICH_DOC {
  constructor(){
    this.doc = {
      toolsset:{
        create:{
          name:['创建','create'],
          type:['功能','function'],
          help:[
            ["p",
            "本页功能主要用于/++ 批量创建画板、图层等 ++/",
            "This page is used for batch creation of /++ frames, layers, etc ++/"],
            ["li",
            "传入大图（长图）可创建大小均匀的切片组, 以避免压缩",
            "Upload large/long images to create evenly-sized slice groups, avoiding compression"],
            ["li",
            "传入带命名、宽高等信息的表格数据则创建画板",
            "Upload table data with name, width, height, etc. to create frames"],
            ["li",
            "传入由本系列插件生成的兼容文件则创建图层",
            "Upload YN+ or other compatible files to create layers"],
            ["li",
            "图片支持格式: <br> /++ .jpg | .jpeg | .jfif | .webp | .png | .apng | .gif ++/",
            "Image file type:<br> /++ .jpg | .jpeg | .jfif | .webp | .png | .apng | .gif ++/"],
            ["li",
            "表格支持格式: <br> /++ .csv | .xls | .xlsx ++/",
            "Table file type: <br> /++ .csv | .xls | .xlsx ++/"],
            ["li",
            "兼容文件支持格式: <br>/++ .zy | .md | .sketch | .svg | .xml | .json | .zip | .rar | .7z ++/",
            "Compatible file type: <br> /++ .zy | .md | .sketch | .svg | .xml | .json | .zip | .rar | .7z ++/"],
            ["br","",""],
            ["p",
            "拖拽和上传文件会立即生成用以确认最终生成内容的/++ 标签/大纲 ++/",
            "Dragging or uploading files immediately converts to /++ tags/catalogue ++/"],
            ["li",
            "拖拽的文件需全部是为图片类、全部是表格类或全部是兼容文件, /++ 不能混杂类型 ++/",
            "Drag and drop files must be all images, tables, or compatible files. /++ Mixed file types are not allowed ++/"],
            ["li",
            "上传文件设置了具体格式, 不支持的格式将无法点选",
            "The three upload buttons restrict the file format, and unsupported formats cannot be uploaded"],
            ["br","",""],
            ["p",
            "通过文本框输入数据, 需要点击第一个按钮来生成标签/大纲",
            "For textarea input, click the first button to convert data to tags/catalogue"],
            ["li",
            "输入表格数据无需包含表头、单位, /++ 可双击文本框查看示例 ++/",
            "No table header or unit needed. /++ Double-click textarea to view example ++/"],
            ["li",
            "可以选中文件里的画板或图层, 然后点击第二个按钮获取命名和宽高数据",
            "Select frames or layers, then click the second button to get name, width and height data"],
            ["li",
            "如果需要制作更复杂的模板, 点击第三个按钮前往资源助手",
            "For complex templates, click the third button to go to /++ YN+ ListEase ++/"],
            ["br","",""],
            ["p",
            "表格数据默认按/++ 命名、宽高、目标文件大小、目标文件格式、补充信息 ++/的顺序读取列, 如需修改规则可点击第四个按钮展开高级设置",
            "Table data reads columns in order: /++ name, width, height, target file size, format, supplementary info ++/. Click the fourth button to modify rules"],
            ["li",
            "修改列顺序规则时需注意,必须包含命名和宽高",
            "Column order rules must include /++ name, width and height ++/"],
            ["li",
            "画板名默认带w×h后缀, 如/++ kv 1920×1080 ++/, 可选择其他预设或自行定义",
            "Frame name defaults to width×height suffix, e.g. /++ kv 1920×1080 ++/. Can select presets or customize"],
          ],
          list:[
            {title:['大图自动切片','Large image slicer'],
              layout:[
                {set:[],items:[
                  ["p",
                  "处理长图时优先用此入口上传, 系统会按照提示自动拆分切片",
                  "For long banners, upload via this entry so the tool auto-slices based on the preset hint"],
                ]},
                {set:[],items:[
                  ["li",
                  "可上传1~10张大图, 支持常见图片格式, 完成后立即生成对应标签记录",
                  "Upload 1–10 large images (common formats), each file immediately becomes a tag entry"],
                ]}
              ]
            },
            {title:['表格创建画板','Table-driven frames'],
              layout:[
                {set:[],items:[
                  ["p",
                  "当需求提供试算表时直接上传, 每一行都会转换为画板配置",
                  "Feed spreadsheet specs directly—each row becomes a frame configuration"],
                ]},
                {set:[],items:[
                  ["li",
                  "上传单个表格, 需按一定格式填写, name/w/h为必填项",
                  "Upload 1 table in the prescribed format, name/w/h are required fields"],
                ]}
              ]
            },
            {title:['兼容格式导入','Compatible bundle import'],
              layout:[
                {set:[],items:[
                  ["p",
                  "YN 系列互通的 /++ .zy | .sketch | .svg | .xml | .json | .zip | .rar | .7z ++/ 都走这条线路",
                  "Route /++ .zy | .sketch | .svg | .xml | .json | .zip | .rar | .7z ++/ bundles through here for seamless YN interoperability"],
                ]},
                {set:[],items:[
                  ["li",
                  "上传由云即系列插件生成的图层信息文件, 解析后保留原有层级与命名",
                  "Upload .zy (by YN+) or other compatible file, resulting tags keep the original hierarchy and naming"],
                ]}
              ]
            },
            {title:['多行文本框','Textarea for TSV'],
              layout:[
                {set:[],items:[
                  ["p",
                  "支持粘贴 TSV 或手动输入, 双击自动填充示例数据便于对照",
                  "Accepts pasted TSV or manual input; double-click to auto-fill the sample for reference"],
                ]},
                {set:[],items:[
                  ["li",
                  "行号、滚动条与表头说明「表头固定用 name,w,h…」帮助快速定位格式问题",
                  "Line numbers, scroll guides, and the header note “Header must use name,w,h…” make troubleshooting easy"],
                ]}
              ]
            },
            {title:['转为标签/大纲','Convert to tags'],
              layout:[
                {set:[],items:[
                  ["p",
                  "解析文本/上传内容生成标签树, 供后续预览与排序",
                  "Parses text/uploads into tag trees ready for preview and reordering"],
                ]},
                {set:[],items:[
                  ["li",
                  "转为标签/大纲, 结果会显示在下方区域",
                  "Convert to tags/catalogue, results appear in the area below"],
                ]}
              ]
            },
            {title:['读取所选对象','Pull data from selection'],
              layout:[
                {set:[],items:[
                  ["p",
                  "可把现有画板的命名、宽高复制到文本框, 便于修改后再批量创建",
                  "Reads names and sizes from current selections back into the textarea for further edits"],
                ]},
                {set:[],items:[
                  ["li",
                  "从所选对象获取数据, 支持多选, 每个节点会生成一行数据",
                  "Retrieve data from the selected node, multi-select generates one row per node"],
                ]}
              ]
            },
            {title:['资源助手','Resource helper'],
              layout:[
                {set:[],items:[
                  ["p",
                  "跳转 YN+ ListEase 以制作更复杂模板, 完成后数据可再导回此处",
                  "Opens YN+ ListEase for complex template authoring, then re-import data here"],
                ]},
                {set:[],items:[
                  ["li",
                  "前往制作更复杂的模板数据, 保持跨工具数据一致",
                  "To create more complex template data, keeps data consistent across tools"],
                ]}
              ]
            },
            {title:['高级设置-生效列','Advanced: effective columns'],
              layout:[
                {set:[],items:[
                  ["p",
                  "用于剔除无用列或调整顺序, 系统会确保关键字段存在",
                  "Use it to drop unused columns or reorder them; the system ensures critical fields are present"],
                ]},
                {set:[],items:[
                  ["li",
                  "重置按钮可以随时恢复 name,w,h,s,type,note,node, 避免误删导致解析失败",
                  "Reset button restores name,w,h,s,type,note,node to prevent parsing errors after accidental edits"],
                ]}
              ]
            },
            {title:['高级设置-命名模板','Advanced: naming template'],
              layout:[
                {set:[],items:[
                  ["p",
                  "统一画板命名后缀, 支持 w×h / w_h / note w×h s 等预设或自定义",
                  "Standardize frame suffixes using presets like w×h/w_h/note w×h s or custom strings"],
                ]},
                {set:[],items:[
                  ["li",
                  "下拉菜单可快速切换模板, 输入框实时反映最新命名规则",
                  "Dropdown menu swaps templates instantly; the input reflects the active naming rule in real time"],
                ]}
              ]
            },
            {title:['标签校对与创建','Tag review & CREATE'],
              layout:[
                {set:[],items:[
                  ["p",
                  "点击转换后, 会生成标签在下方, 可以复核信息、勾选最终生成的部分",
                  "After clicking convert, tags are generated below for review and selection of final items to create"],
                ]},
                {set:[],items:[
                  ["li",
                  "可点击关闭按钮清空标签, 底部「CREATE」按钮会根据当前勾选的内容一次性生成画板/图层",
                  "Click the close button to clear tags; the \"CREATE\" button at the bottom generates frames/layers based on current selections"],
                ]}
              ]
            }
          ],
          error:[
            ["上传文件格式不支持: 请检查文件格式是否符合要求, 图片需为常见格式, 表格需为 /++ .csv | .xls | .xlsx ++/",
            "Unsupported file format: Check if the file format meets requirements, images must be common formats, tables must be .csv | .xls | .xlsx"],
            ["表格缺少必填项: 确保表格包含 name、w、h 等必填列, 检查列名是否正确",
            "Missing required fields in table: Ensure the table contains required columns like name, w, h, check if column names are correct"],
            ["标签生成失败: 检查输入数据格式是否正确, 表格数据是否包含表头或格式错误",
            "Tag generation failed: Check if input data format is correct, whether table data contains headers or format errors"],
            ["创建画板/图层失败: 确认已勾选要创建的项目, 检查命名是否包含非法字符",
            "Failed to create frames/layers: Confirm that items to create are selected, check if names contain invalid characters"],
          ],
        },
        export:{
          name:['导出','export'],
          type:['功能','function'],
          help:[
            ["p",
            "导出页聚合/++ Image | .zy | Rich Text ++/三种输出方式, 统一管理渲染任务",
            "The Export page consolidates /++ Image | .zy | Rich Text ++/ outputs so every rendering job stays organized"],
            ["li",
            "上传或拖拽所选对象后生成导出标签, /++ 渲染队列 ++/支持单选、全选、重新上传",
            "Uploading or dragging the selection produces export tags; the /++ render queue ++/ supports single, bulk and re-upload actions"],
            ["li",
            "每条记录保留名称、尺寸、倍率等信息, 修改会自动保存, 方便下次复用",
            "Each record stores name, size and scale; edits are automatically saved for easy reuse"],
            ["li",
            "Image可自定义缩放与格式, .zy可与YN系列工具互通, Rich Text生成可复制的标签化描述",
            "Image exports accept custom scaling and formats, .zy stays compatible with other YN tools, Rich Text outputs copy-ready tagged descriptions"],
            ["li",
            "预览区支持缩放检查、批量删除或下载, 也能快速定位失败记录并重试",
            "The preview area offers zoom inspection, bulk delete/download, and quick retries for failed jobs"],
            ["li",
            "导出动作会按所选类型进行处理, 完成后显示状态提示与预计体积",
            "The export action processes according to the selected type and reports status plus estimated file size on completion"],
          ],
          list:[
            {title:['导出类型','Export type'],
              layout:[
                {set:[],items:[
                  ["p",
                  "先选好 Image/.zy/Rich Text, 后续标签会带对应字段",
                  "Pick Image/.zy/Rich Text first so tags expose the right fields"],
                ]},
                {set:[],items:[
                  ["li",
                  "导出类型选择提供三种模式, 每个选项都有中英文标签",
                  "Export type selector offers three modes, each option labeled in both languages"],
                ]}
              ]
            },
            {title:['上传(默认)','Upload (Default)'],
              layout:[
                {set:[],items:[
                  ["p",
                  "用于快速记录当前选区, 不附带历史参数",
                  "Use this for quick captures of the current selection without previous params"],
                ]},
                {set:[],items:[
                  ["li",
                  "按钮位于导出类型选择下方, 点击后把所选节点按当前导出类型生成标签",
                  "Located below the export type selector; clicking converts the selection into tags for the active export type"],
                ]}
              ]
            },
            {title:['上传(导出设置)','Upload (Export-set)'],
              layout:[
                {set:[],items:[
                  ["p",
                  "会带出上次保存的尺寸、倍率、格式参数",
                  "Restores size/scale/format saved from previous runs"],
                ]},
                {set:[],items:[
                  ["li",
                  "适合复用常用规格, 追加到队列后仍可单独修改字段",
                  "Ideal for recurring specs; after queuing you can still tweak each field manually"],
                ]}
              ]
            },
            {title:['展开更多','Toggle more controls'],
              layout:[
                {set:[],items:[
                  ["p",
                  "勾选「展开更多」选项展开批处理工具条",
                  "Check the \"More\" option to reveal batch controls"],
                ]},
                {set:[],items:[
                  ["li",
                  "展开后可以批量全选或全删导出记录",
                  "When expanded, you can select all or delete all export entries in batch"],
                ]}
              ]
            },
            {title:['删除','Delete selected tags'],
              layout:[
                {set:[],items:[
                  ["p",
                  "批量移除当前勾选的导出记录",
                  "Batch-remove the currently checked export entries"],
                ]},
                {set:[],items:[
                  ["li",
                  "删除按钮包含图标和文字, 支持多选批量删除",
                  "The delete button with icon and text supports multi-selection for batch deletion"],
                ]}
              ]
            },
            {title:['重新上传','Re-upload selected'],
              layout:[
                {set:[],items:[
                  ["p",
                  "对失败或更新后的节点重新发起上传",
                  "Re-trigger upload for failed or updated nodes"],
                ]},
                {set:[],items:[
                  ["li",
                  "按钮显示「重新上传」, 会按相同导出类型重新生成记录",
                  "Button labeled \"Re-Upload\"; it regenerates entries using the same export type"],
                ]}
              ]
            },
            {title:['全选','Select all checkbox'],
              layout:[
                {set:[],items:[
                  ["p",
                  "快速勾选全部导出标签, 配合删除/重传效率更高",
                  "Toggle every tag at once for faster delete/re-upload flows"],
                ]},
                {set:[],items:[
                  ["li",
                  "全选复选框可以一键勾选或取消所有标签",
                  "The select-all checkbox can toggle all tags at once"],
                ]}
              ]
            },
            {title:['图片标签','Image tag'],
              layout:[
                {set:[],items:[
                  ["p",
                  "存放所有普通图片导出记录, 支持编辑名称/目标尺寸/倍率",
                  "Holds all Image exports; in-place edit name, target size, and scale"],
                ]},
                {set:[],items:[
                  ["li",
                  "位于图片导出区域, 字段修改会自动保存供下次使用",
                  "Located in the image export area; any field edits are automatically saved for future use"],
                ]}
              ]
            },
            {title:['节点标签','.zy tag'],
              layout:[
                {set:[],items:[
                  ["p",
                  "专门管理 .zy 兼容格式, 字段包含类型、压缩方式等",
                  "Dedicated to .zy compatible exports, exposing type/compression fields"],
                ]},
                {set:[],items:[
                  ["li",
                  ".zy 导出区域中的每条记录都能与 YN 系列插件互通",
                  "Each entry in the .zy export area can interoperate with other YN plugins"],
                ]}
              ]
            },
            {title:['富文本标签','Rich text'],
              layout:[
                {set:[],items:[
                  ["p",
                  "生成带标签的文本描述, 支持复制到 PRD/交付文档",
                  "Produces tagged text descriptions ready to paste into PRDs/deliverables"],
                ]},
                {set:[],items:[
                  ["li",
                  "位于富文本导出区域, 可以编辑段落模板或语言标记",
                  "Located in the rich text export area where you can tweak paragraph templates and locale markers"],
                ]}
              ]
            },
            {title:['导出','Export'],
              layout:[
                {set:[],items:[
                  ["p",
                  "触发当前队列渲染, 完成后给出状态 + 预计体积",
                  "Runs the queue renderer and reports status plus estimated size"],
                ]},
                {set:[],items:[
                  ["li",
                  "EXPORT 按钮会触发导出, 失败记录会在预览区高亮并提示可重试",
                  "The EXPORT button triggers export; failed entries are highlighted in the preview with retry suggestions"],
                ]}
              ]
            }
          ],
          error:[
            ["导出失败: 检查所选对象是否有效, 导出类型是否匹配, 文件大小是否超出限制",
            "Export failed: Check if selected objects are valid, export type matches, file size is within limits"],
            ["预览区无内容: 确认已上传或拖拽对象, 检查导出类型选择是否正确",
            "Preview area empty: Confirm objects are uploaded or dragged, check if export type is selected correctly"],
            ["导出记录丢失: 检查是否误删, 刷新页面后记录会清空, 建议及时导出",
            "Export records lost: Check if accidentally deleted, records are cleared after page refresh, recommend exporting in time"],
          ],
        },
        editor:{
          name:['编辑','editor'],
          type:['功能','function'],
          help:[
            ["p",
            "编辑页提供滤镜栈, 支持/++ Up Editable ++/矢量模式与/++ Up Pixel ++/像素模式",
            "The Editor page offers a filter stack with /++ Up Editable ++/ vector mode and /++ Up Pixel ++/ bitmap mode"],
            ["li",
            "Editable保留矢量与文本结构, Pixel会导出PNG后再应用滤镜, 适合快速调色",
            "Editable keeps vector/text structure, while Pixel rasterizes to PNG before applying filters for quick grade tweaks"],
            ["li",
            "滤镜栈包含亮度、对比度、色相/饱和度、模糊等常用选项, 可随意增删与排序",
            "The stack covers brightness, contrast, hue/saturation, blur and more, and you can add/remove/reorder freely"],
            ["li",
            "可导出JSON预设或粘贴JSON/代码片段快速载入, 方便跨文件复用配置",
            "Export presets as JSON or paste JSON/code snippets to load them instantly and reuse across files"],
            ["li",
            "独立预览区支持切换背景色、缩放、重置, 便于对比原图与效果",
            "An independent preview area lets you change background, zoom and reset to compare before/after"],
            ["li",
            "一次仅处理一个选区, 应用后可写回原对象或另存新节点, 也可清空栈重新开始",
            "It handles one selection at a time; after applying you can write back to the node, save a new one, or clear the stack to restart"],
          ],
          list:[
            {title:['上传(可编辑)','Upload (Editable)'],
              layout:[
                {set:[],items:[
                  ["p",
                  "保持矢量/文本结构并直接在 Figma 内应用",
                  "Keeps vector/text fidelity for in-place application"],
                ]},
                {set:[],items:[
                  ["li",
                  "按钮位于提示下方, 依赖当前 selection, 上传后滤镜栈即可编辑",
                  "Button sits below the instruction; once clicked, the current selection becomes editable in the filter stack"],
                ]}
              ]
            },
            {title:['上传(栅格化)','Upload (Pixel)'],
              layout:[
                {set:[],items:[
                  ["p",
                  "将所选节点导出为 PNG 再调色, 适合复杂矢量或含混合模式的图层",
                  "Exports the selection as PNG prior to grading—great for complex vectors or blend-heavy layers"],
                ]},
                {set:[],items:[
                  ["li",
                  "应用前请勿修改原图层, 避免写回失败或错位",
                  "Don't alter the original layer before applying, to avoid writeback failures or misalignment"],
                ]}
              ]
            },
            {title:['新增滤镜','Add filter entry'],
              layout:[
                {set:[],items:[
                  ["p",
                  "点击“调整 +”按钮即可追加亮度/对比/色相等节点",
                  "Hit the “Filter +” button to append brightness/contrast/hue entries"],
                ]},
                {set:[],items:[
                  ["li",
                  "每个滤镜区块会显示在滤镜列表中, 对应参数显示在控制面板中",
                  "Each filter block appears in the filter list with its controls shown in the control panel"],
                ]}
              ]
            },
            {title:['排序/复制/删除滤镜','Manage filter order'],
              layout:[
                {set:[],items:[
                  ["p",
                  "可拖拽排序、复制条目或关闭单个滤镜, 实时反映在预览",
                  "Drag to reorder, duplicate, or close filters with immediate preview feedback"],
                ]},
                {set:[],items:[
                  ["li",
                  "每项内置开关/数值输入/强度滑块, 改动会即时反映在预览区",
                  "Each entry offers toggles, inputs, and sliders; edits are immediately reflected in the preview area"],
                ]}
              ]
            },
            {title:['清空/全屏控制','Clear & full view'],
              layout:[
                {set:[],items:[
                  ["p",
                  "快速对比原图与效果, 需要时可清空栈或拉伸预览",
                  "Compare before/after easily by clearing the stack or expanding the preview"],
                ]},
                {set:[],items:[
                  ["li",
                  "清空按钮可一键移除所有滤镜; 全屏选项让预览占据整个画布",
                  "The clear button removes all filters at once; the fullscreen option makes the preview occupy the entire canvas"],
                ]}
              ]
            },
            {title:['导入预设','Import preset'],
              layout:[
                {set:[],items:[
                  ["p",
                  "上传 .json 配置, 迅速恢复团队常用滤镜栈",
                  "Load a .json to restore team-standard stacks instantly"],
                ]},
                {set:[],items:[
                  ["li",
                  "隐藏 file input 接受 .json, 图标提示“导入”, 完成后自动填充所有滤镜项",
                  "Hidden file input accepts .json; the “Import” icon handles upload and populates the filters automatically"],
                ]}
              ]
            },
            {title:['导出预设','Export preset'],
              layout:[
                {set:[],items:[
                  ["p",
                  "把当前滤镜栈保存为 JSON, 便于跨文件共享",
                  "Save the current stack as JSON for reuse across files"],
                ]},
                {set:[],items:[
                  ["li",
                  "点击“导出”图标即可下载配置, 也能粘贴到其他工具",
                  "Click the “Export” icon to download the config or copy it into other tools"],
                ]}
              ]
            },
            {title:['代码模式','Code mode'],
              layout:[
                {set:[],items:[
                  ["p",
                  "切换代码模式开关展开代码编辑区",
                  "Toggle the code mode switch to reveal the code editor"],
                ]},
                {set:[],items:[
                  ["li",
                  "可直接粘贴/修改 JSON 片段, 改动会同步到 UI 控件, 方便高级用户调参",
                  "Paste or edit JSON snippets; changes sync to the UI controls for power users"],
                ]}
              ]
            },
            {title:['预览窗口','Preview canvas'],
              layout:[
                {set:[],items:[
                  ["p",
                  "所有滤镜效果都会在该区域实时展示",
                  "All filter effects render live inside this viewbox"],
                ]},
                {set:[],items:[
                  ["li",
                  "支持滚动/缩放, 方便检视局部像素, 亦可配合背景色切换观察透明度",
                  "Supports scroll/zoom for detail inspection and pairs with background toggles for transparency checks"],
                ]}
              ]
            },
            {title:['背景与取色','Background & color pick'],
              layout:[
                {set:[],items:[
                  ["p",
                  "调节预览底色, 更容易判断滤镜对透明或暗部的影响",
                  "Adjust the preview backdrop to judge transparency/dark region effects"],
                ]},
                {set:[],items:[
                  ["li",
                  "勾选背景选项打开取色器, 可以输入 HEX/RGB 或使用吸管工具",
                  "Check the background option to open the color picker where you can input HEX/RGB or use the eyedropper"],
                ]}
              ]
            },
            {title:['应用','Apply'],
              layout:[
                {set:[],items:[
                  ["p",
                  "完成调色后点击 APPLY 将结果写回或另存",
                  "Click APPLY after grading to write back or create a new node"],
                ]},
                {set:[],items:[
                  ["li",
                  "成功会在提示区域确认, 若失败会给出原因并保持滤镜栈以便继续调整",
                  "Success prompts confirmation; failures explain the reason and keep the stack for further tweaks"],
                ]}
              ]
            }
          ],
          error:[
            ["滤镜应用失败: 检查所选对象是否支持编辑, 确认原图层未被修改",
            "Filter application failed: Check if selected object supports editing, confirm original layer is not modified"],
            ["预览无效果: 确认已添加滤镜, 检查滤镜参数设置是否正确",
            "No preview effect: Confirm filters are added, check if filter parameters are set correctly"],
            ["导入预设失败: 检查 JSON 格式是否正确, 确认预设文件完整",
            "Import preset failed: Check if JSON format is correct, confirm preset file is complete"],
          ],
        },
        variable:{
          name:['变量','variable'],
          type:['功能','function'],
          help:[
            ["p",
            "变量页整合样式与变量, 打造/++ 检测 → 新建 → 刷新 → 应用 ++/闭环",
            "The Variable page unifies styles and variables to form a /++ detect → create → refresh → apply ++/ loop"],
            ["li",
            "可在样式与变量视图间切换, 扫描当前文件收集Paint/Text/Effect样式及Variable Collection",
            "Toggle between Style and Variable views to scan the file for paint/text/effect styles plus variable collections"],
            ["li",
            "支持一键生成演示用Paint Style与Variable Collection, 适合空文件或教学场景",
            "Generate demo paint styles and variable collections with one click for empty files or teaching demos"],
            ["li",
            "会创建本地/++ xxx@localsheet ++/表格保存快照, Sheet与Variable可双向同步",
            "It creates a local /++ xxx@localsheet ++/ table as a snapshot, enabling two-way sync between the sheet and variables"],
            ["li",
            "扩展工具可扫描断链样式、批量重链或覆盖, 也能按所选组件匹配变量组",
            "Extended tools scan broken styles, relink or overwrite in bulk, and match variable sets for the current selection"],
            ["li",
            "刷新时会重新读取文档并保留上次设置与搜索条件, 减少重复操作",
            "Refreshing re-reads the document while keeping previous settings and filters to avoid repetitive steps"],
          ],
          list:[
            {title:['类型切换','Type selector'],
              layout:[
                {set:[],items:[
                  ["p",
                  "切换“样式/变量”后, 下方面板加载对应资产",
                  "Switch “Style/Variable” to load the relevant assets below"],
                ]},
                {set:[],items:[
                  ["li",
                  "类型切换面板包含两个选项, 文字标签显示当前上下文",
                  "The type selector panel contains two options with a label showing the current context"],
                ]}
              ]
            },
            {title:['整理视图','Relayout toggle'],
              layout:[
                {set:[],items:[
                  ["p",
                  "列表内容太长时点击重新排布, 方便对齐查看",
                  "When lists get long, click to reorganize them for easier inspection"],
                ]},
                {set:[],items:[
                  ["li",
                  "按钮位于类型切换旁, 点击后重排变量/样式两侧列表",
                  "Located beside the type selector; clicking reorders both variable and style lists"],
                ]}
              ]
            },
            {title:['变量集状态','Variable-set status'],
              layout:[
                {set:[],items:[
                  ["p",
                  "指示是否检测到 Variable Collection, 并提供示例入口",
                  "Indicates if a Variable Collection exists and offers a sample shortcut"],
                ]},
                {set:[],items:[
                  ["li",
                  "当变量信息区显示「未读取到变量集」时, 配合「示例」按钮可快速生成 demo",
                  "When the variable info area shows \"Find not variable-set\", the \"Sample\" button creates a demo set"],
                ]}
              ]
            },
            {title:['变量表状态','Variable sheet status'],
              layout:[
                {set:[],items:[
                  ["p",
                  "没有本地变量表时, “新建”按钮会立刻创建 @localsheet",
                  "If no local variable sheet exists, the “New” button creates a @localsheet immediately"],
                ]},
                {set:[],items:[
                  ["li",
                  "当显示「未读取到变量表」时点击 New, 系统会记录表位置供同步",
                  "When “Find not local sheet” shows, clicking New stores the sheet reference for syncing"],
                ]}
              ]
            },
            {title:['样式集状态','Style-set status'],
              layout:[
                {set:[],items:[
                  ["p",
                  "切到样式模式后, 状态卡会告知是否已有样式集",
                  "In Style mode this card reveals whether a style-set was detected"],
                ]},
                {set:[],items:[
                  ["li",
                  "“未读取到样式集”搭配“示例”按钮, 适合教学或空文件",
                  "\"Find not style-set\" plus “Sample” helps demo or empty files quickly"],
                ]}
              ]
            },
            {title:['样式表状态','Style sheet status'],
              layout:[
                {set:[],items:[
                  ["p",
                  "本地样式表缺失时可新建, 以便与 localsheet 同步",
                  "Create a local style sheet when missing so it can sync with localsheet"],
                ]},
                {set:[],items:[
                  ["li",
                  "当显示「未读取到样式表」时点击「新建」生成管理表",
                  "When \"Find not local sheet\" appears, hit \"New\" to generate the management sheet"],
                ]}
              ]
            },
            {title:['刷新按钮','Refresh scanned data'],
              layout:[
                {set:[],items:[
                  ["p",
                  "重新扫描文档, 更新变量或样式的检测状态",
                  "Rescan the document to refresh variable or style detection"],
                ]},
                {set:[],items:[
                  ["li",
                  "变量侧与样式侧各有 refresh 图标, 点击后立即重查并更新状态图标",
                  "Both sides have refresh icons; clicking reruns detection and updates the status badges"],
                ]}
              ]
            },
            {title:['变量 ↔ 表同步按钮','Bidirectional sync'],
              layout:[
                {set:[],items:[
                  ["p",
                  "通过“从变量更新表 / 从表更新变量”保持数据一致",
                  "Keep data aligned via “Variable To Sheet / Sheet To Variable”"],
                ]},
                {set:[],items:[
                  ["li",
                  "两个同步按钮并列, 分别用于从变量更新表格或从表格更新变量",
                  "Two sync buttons side by side, one updates the sheet from variables, the other updates variables from the sheet"],
                ]}
              ]
            },
            {title:['扫描所选','Scan selection'],
              layout:[
                {set:[],items:[
                  ["p",
                  "把当前选中的组件加入管理列表, 作为映射目标",
                  "Add the current selection into the management list as mapping targets"],
                ]},
                {set:[],items:[
                  ["li",
                  "按钮文字「扫描所选」, 可多次点击累计对象, 结果会显示在管理列表中",
                  "Button labeled \"Scan selection\"; click repeatedly to accumulate entries in the management list"],
                ]}
              ]
            },
            {title:['列表管理与清空','Manage list & clear'],
              layout:[
                {set:[],items:[
                  ["p",
                  "管理列表支持多选、排序、编辑标签属性, 右上角关闭按钮可清空列表",
                  "The management list supports multi-select, ordering, and editing tag mappings; the close button in the top right clears it"],
                ]},
                {set:[],items:[
                  ["li",
                  "清空列表不会影响已经保存到表格或变量的数据, 只是移除待处理清单",
                  "Clearing the list leaves saved sheet/variable data intact—only the working queue is cleared"],
                ]}
              ]
            }
          ],
          error:[
            ["变量/样式未检测到: 确认文件中有 Variable Collection 或样式集, 点击刷新重新扫描",
            "Variables/styles not detected: Confirm file has Variable Collection or style sets, click refresh to rescan"],
            ["同步失败: 检查表格格式是否正确, 确认变量/样式名称是否存在",
            "Sync failed: Check if table format is correct, confirm variable/style names exist"],
            ["扫描所选失败: 确认已选中组件, 检查组件是否包含必要的属性",
            "Scan selection failed: Confirm components are selected, check if components contain necessary properties"],
          ],
        },
        sheet:{
          name:['表单','sheet'],
          type:['功能','function'],
          help:[
            ["p",
              "使用本功能需要掌握【组件】和【组件属性】等基本知识",
              "Requires basic knowledge of Components and Component Properties"],
              ["li",
              "组件使元素能保持一致的样式, 并通过实例的/++ 继承性 ++/实现批量控制样式",
              "Components maintain consistent styles and enable batch control via instance /++ inheritance ++/"],
              ["li",
              "组件属性是将需要修改的样式以表单的形式放在属性栏最上方, 方便/++ 参数化管理组件 ++/",
              "Component Properties display editable styles as forms at the top for /++ parameterized component management ++/"],
              ["p",
              "表格由至少两个组件: /++ xxx@th(表头) | xxx@td(表数据) ++/, 嵌套自动布局而成, 请注意, 这里采用先按列再按行的布局, 与常见表格逻辑相反, 但更适合设计领域",
              "Table built with auto-layout from at least 2 components: /++ xxx@th(header) | xxx@td(data) ++/. Layout is column-first then row, opposite to common table logic but better for design"],
              ["li",
              "首次使用该功能, 建议直接点击按钮生成一个表格示例, 以便理解其中的规范要求",
              "First-time users: click button to generate a table example to understand requirements"],
              ["li",
              "默认生成3*3的表格, 也可以输入具体行列来生成, 但随后填充数据时会自动调节行列",
              "Defaults to 3×3 table. Can input specific rows/columns, auto-adjusts when filling data"],
              ["li",
              "默认先生成表头和表格组件, 如选中了命名为xxx@th和xxx@td的组件, 则会直接生成表格",
              "By default, generates header and cell components first. If xxx@th and xxx@td are selected, generates table directly"],
              ["li",
              "组件必须包含用多个图层实现的描边和填充, 并绑定/++ 布尔类型组件属性: --bod-l(左描边) | --bod-r(右描边) | --bod-t(上描边) | --bod-b(下描边) | --fills(填充) ++/",
              "Components must include strokes and fills (multiple layers) bound to /++ boolean properties: --bod-l(left) | --bod-r(right) | --bod-t(top) | --bod-b(bottom) | --fills(fill) ++/"],
              ["li",
              "组件会先包裹在一个列中xxx@column, xxx@th会始终在第一个, 然后多个列会包裹在一个表中xxx@table",
              "Components wrap in xxx@column first, xxx@th always first, then multiple columns wrap in xxx@table"],
              ["li",
              "组件必须包含一个文字图层, 并绑定/++ 字符类型组件属性: --data(数值/文本) ++/",
              "Components must include a text layer bound to /++ text property: --data(value/text) ++/"],
              ["br","",""],
              ["p",
              "因为【组件属性】功能的强大, 我们会有很多办法实现批量替换数据, 不仅限于表格, 因此【表格】可视为【批量替换数据】的一种特殊情况",
              "Component Properties enable various batch data replacement methods beyond tables. Tables are a special case of batch data replacement"],
              ["li",
              "使用【文本数据映射】时, 仅检索xxx@table下,每列xxx@column的xxx@th和xxx@td的--data属性进行修改",
              "Text Data Mapping only modifies --data property of xxx@th and xxx@td in each xxx@column under xxx@table"],
              ["li",
              "如需要更复杂的组件属性组合, 需使用【组件属性映射】功能来完成数据映射",
              "For complex component property combinations, use Component Property Mapping"],
              ["li",
              "【文本数据映射】不需要表头匹配, 直接按行列对应关系填充数据, 【组件属性映射】则需要将组件属性名作为表头, 按图层顺序修改对应的值",
              "Text Data Mapping fills data by row/column without header matching. Component Property Mapping uses property names as headers, modifies values by layer order"],
              ["li",
              "【组件属性映射】对变体的选项值也同样生效,需设置唯一的变体属性名(默认是Property) 需避免存在同名的情况, 变体集内的组件命名无影响",
              "Component Property Mapping also works for variant options. Set unique variant property name (default: Property), avoid duplicates. Component names in variant sets don't matter"],
              ["br","",""],
              ["p",
              "通过将xxx@th和xxx@td组件宽度设置为充满, 我们可以轻松地用xxx@column控制列宽,也可以直接在图层里连选列内的xxx@td, 而选中行的方式可能比较复杂",
              "Set xxx@th and xxx@td width to fill to control column width via xxx@column, or select xxx@td in layers. Row selection is more complex"],
              ["li",
              "【选中单行】功能可以查找相邻父级同位置的图层, 请确保图层结构的一致性",
              "Select Single Row finds adjacent parent layers at same position. Ensure consistent layer structure"],
              ["li",
              "【选中多行】功能可以选中多个单行",
              "Select Multiple Rows selects multiple single rows"],
              ["li",
              "【区域选中】功能类似框选, 会在选中两个xxx@td形成的框内所有的xxx@td ",
              "Area Select works like marquee, selects all xxx@td within box formed by two selected xxx@td"],
              ["li",
              "【连续选中】功能可类似文本段落的连选, 会从第一个xxx@td开始逐行选中, 到第二个xxx@td结束",
              "Continuous Select works like text selection, selects from first xxx@td row by row to second xxx@td"],
              ["li",
              "选中后插件还是聚焦状态, 此时无法对画布内容进行操作, 可以用鼠标中建点击画布区域以重新聚焦到画布",
              "After selection, plugin remains focused. Middle-click canvas to refocus"],
              ["br","",""],
              ["p",
              "为弥补组件属性的局限性问题, 可使用【标签属性映射】来完成 /++ #xxx.fill(填充色值) | #xxx.stroke(描边色值) | #xxx.fillStyle(填充样式名) | #xxx.strokeStyle(描边样式名)| #xxx.visible(可见性true/false) | #xxx.opacity(透明度0~1) | #xxx.fontSize(字号) ++/ 的参数化控制",
              "Use Tag Property Mapping to overcome component property limitations: /++ #xxx.fill | #xxx.stroke | #xxx.fillStyle | #xxx.strokeStyle | #xxx.visible(true/false) | #xxx.opacity(0~1) | #xxx.fontSize ++/"],
              ["li",
              "选中的对象将按图层顺序对应每一行的数值,修改时会先判断对象是否带标签, 然后再遍历子对象, 对象/子对象本身可以包含多个标签, 可以存在不同的标签组合, /++ 注意标签与命名或其他标签之间要用空格隔开 ++/, 这对实现更复杂的样式变化很有用 ",
              "Selected objects correspond to each row by layer order. Checks for tags first, then traverses children. Objects/children can have multiple tags with different combinations. /++ Separate tags/names with spaces ++/. Useful for complex style variations"],
          ],
          list:[
            {title:['组件与模板要求','Component & template requirements'],
              layout:[
                {set:[],items:[
                  ["p",
                  "xxx@th / xxx@td 模板需包含文字图层、描边/填充图层, 并绑定 --data 与 --bod-* 等属性",
                  "xxx@th / xxx@td templates need text layers plus stroke/fill layers bound to --data and --bod-* props"],
                ]},
                {set:[],items:[
                  ["li",
                  "组件会先放入 xxx@column, 再汇入 xxx@table, 命名需遵循 xxx@xx 结构方便映射",
                  "Nest components as xxx@column → xxx@table and keep xxx@xx naming so mapping rules work"],
                ]}
              ]
            },
            {title:['生成示例表格','Generate demo table'],
              layout:[
                {set:[],items:[
                  ["p",
                  "首次使用可直接点击【生成示例】创建 3×3 demo, 观察命名规范与属性绑定",
                  "Use the “Generate Sample” button to spawn a 3×3 demo that showcases naming and bindings"],
                ]},
                {set:[],items:[
                  ["li",
                  "若已选择自定义 xxx@th / xxx@td 组件, 会直接按所选模板生成完整表格",
                  "If custom xxx@th/xxx@td components are preselected the table builds directly from them"],
                ]}
              ]
            },
            {title:['行列与命名模板','Rows, columns & naming'],
              layout:[
                {set:[],items:[
                  ["p",
                  "通过输入行列或 drag handle 可以定义初始表格尺寸, 填充数据时会自动扩缩",
                  "Use the row/column inputs (or drag handle) to set an initial grid that auto-expands when data flows in"],
                ]},
                {set:[],items:[
                  ["li",
                  "【画板命名模板】支持 w×h / note w_h 等预设, 也可自定义占位符应用到标签",
                  "Frame naming templates include w×h, note w_h, etc., and custom placeholders can be applied to tags"],
                ]}
              ]
            },
            {title:['文本数据映射','Text data mapping'],
              layout:[
                {set:[],items:[
                  ["p",
                  "针对文本数据, 直接按行列顺序填充到表格单元格",
                  "Maps text data by row/column order to table cells"],
                ]},
                {set:[],items:[
                  ["li",
                  "无需表头匹配, 适合批量改文案或替换排行榜数值",
                  "No header matching required, perfect for mass text updates like leaderboards or price lists"],
                ]}
              ]
            },
            {title:['组件属性映射','Component property mapping'],
              layout:[
                {set:[],items:[
                  ["p",
                  "当需要批量改组件属性时, 以组件属性名称为表头进行匹配",
                  "When editing component properties, treat property names as headers to align data"],
                ]},
                {set:[],items:[
                  ["li",
                  "支持设置变体属性, 但需确保属性名唯一 (默认 Property) 以免冲突",
                  "Variant properties are supported but require unique property names (default \"Property\") to avoid conflicts"],
                ]}
              ]
            },
            {title:['标签属性映射','Tag property mapping'],
              layout:[
                {set:[],items:[
                  ["p",
                  "若组件属性不足, 可通过标签映射控制 #xxx.fill / #xxx.stroke / #xxx.visible 等",
                  "Use tag mapping when component props fall short to drive #xxx.fill/#xxx.stroke/#xxx.visible, etc."],
                ]},
                {set:[],items:[
                  ["li",
                  "系统会先判断节点/子节点是否带标签, 支持多标签组合, 需以空格分隔标签与命名",
                  "The mapper checks nodes/subnodes for tags (supports combos) and requires spaces between tags and names"],
                ]}
              ]
            },
            {title:['选区助手','Selection helpers'],
              layout:[
                {set:[],items:[
                  ["p",
                  "提供单行、多行、区域、连续等操作, 方便在复杂表格中快速选中目标",
                  "Single/multi/area/continuous selection modes make it easier to target cells in complex tables"],
                ]},
                {set:[],items:[
                  ["li",
                  "操作完成后插件仍保持焦点, 需中键点击画布才能回到 Figma 画布交互",
                  "After a selection the plugin stays focused; middle-click the canvas to resume Figma interactions"],
                ]}
              ]
            },
            {title:['使用建议','Usage tips'],
              layout:[
                {set:[],items:[
                  ["p",
                  "常见场景包括制作排行榜、参数表、价格卡及按主题切换的模板",
                  "Typical use cases: leaderboards, spec sheets, pricing grids, or theme-swappable templates"],
                ]},
                {set:[],items:[
                  ["li",
                  "结合本地 @localsheet 可追踪迭代历史, 并与 Variable / Style 页保持同步",
                  "Paired with the local @localsheet you can version changes and sync with Variable/Style pages"],
                ]}
              ]
            },
          ],
          error:[
            ["表格生成失败: 检查组件命名是否符合 xxx@th 和 xxx@td 规范, 确认组件包含必要的属性绑定",
            "Table generation failed: Check if component names follow xxx@th and xxx@td conventions, confirm components have necessary property bindings"],
            ["数据映射失败: 检查表格数据格式是否正确, 确认表头与组件属性名匹配",
            "Data mapping failed: Check if table data format is correct, confirm headers match component property names"],
            ["选中操作失败: 确认已选中正确的表格单元格, 检查图层结构是否一致",
            "Selection operation failed: Confirm correct table cells are selected, check if layer structure is consistent"],
            ["标签属性映射失败: 检查标签格式是否正确, 确认标签与命名之间用空格分隔",
            "Tag property mapping failed: Check if tag format is correct, confirm tags and names are separated by spaces"],
          ],
        },
        more_tools:{
          name:['更多功能','more tools'],
          type:['功能','function'],
          help:[
            ['p',
            '汇总收藏、像素、图层、矢量、样式等模块化工具, 作为扩展入口',
            'Collects favorites, pixel, layer, vector and style mini-tools as the expansion hub'
            ]
          ],
          list:[
            {title:['常用功能（收藏）','Useful & Starts'],
              layout:[
                {set:[],items:[
                  ["p",
                  "收藏区用于固定 PRD、FAQ、版本记录等常用链接",
                  "Favorites pin PRDs, FAQs, release logs or any frequently opened link"],
                ]},
                {set:[],items:[
                  ["li",
                  "可手动添加/排序卡片, 并用收藏按钮快速定位高频入口",
                  "Add and reorder cards manually; the favorite toggle keeps high-traffic links on top"],
                ]}
              ]
            },
            {title:['像素&变换','Pixel & Transform'],
              layout:[
                {set:[],items:[
                  ["p",
                  "保持层级的同时生成位图副本, 便于比对与回滚",
                  "Generates bitmap backups without flattening hierarchy for quick comparisons/rollback"],
                ]}
              ]
            },
            {title:['文本&图层','Text & Layer'],
              layout:[
                {set:[],items:[
                  ["p",
                  "汇总文本、图层等工具, 方便集中使用",
                  "Collects text and layer tools for centralized use"],
                ]},
                {set:[],items:[
                  ["li",
                  "可设倍率、命名模板并自动保存, 下次在导出页可直接复用",
                  "Set scale and naming templates which are automatically saved, then reuse them from the Export page later"],
                ]}
              ]
            },
            {title:['矢量&生成','Vector & Generate'],
              layout:[
                {set:[],items:[
                  ["p",
                  "汇总矢量、生成等工具, 方便集中使用",
                  "Collects vector and generate tools for centralized use"],
                ]}
              ]
            },
            {title:['样式&原型','Style & Prototype'],
              layout:[
                {set:[],items:[
                  ["p",
                  "汇总样式、原型等工具, 方便集中使用",
                  "Collects style and prototype tools for centralized use"],
                ]}
              ]
            },
            {title:['原地栅格化','in-iitu rasterize'],
              layout:[
                {set:[],items:[
                  ["p",
                  "原地栅格化页提供按行列/宫格切分长图、批量统一缩放/替换填充等功能, 确保多规格导出一致",
                  "The InSituRasterize page provides row/column or nine-grid slicing for long pages, batch uniform scaling/replacement fill features to ensure consistent multi-size exports"],
                ]}
              ]
            },
            {title:['等比缩放','uniform scale'],
              layout:[
                {set:[],items:[
                  ["p",
                  "等比缩放页提供按行列/宫格切分长图、批量统一缩放/替换填充等功能, 确保多规格导出一致",
                  "The Uniform Scale page provides row/column or nine-grid slicing for long pages, batch uniform scaling/replacement fill features to ensure consistent multi-size exports"],
                ]}
              ]
            },
            {title:['斜切','skew'],
              layout:[
                {set:[],items:[
                  ["p",
                  "斜切页提供按行列/宫格切分长图、批量统一缩放/替换填充等功能, 确保多规格导出一致",
                  "The Skew page provides row/column or nine-grid slicing for long pages, batch uniform scaling/replacement fill features to ensure consistent multi-size exports"],
                ]}
              ]
            },
            {title:['宫格裁切','clip by grid'],
              layout:[
                {set:[],items:[
                  ["p",
                  "宫格裁切页提供按行列/宫格切分长图、批量统一缩放/替换填充等功能, 确保多规格导出一致",
                  "The Clip By Grid page provides row/column or nine-grid slicing for long pages, batch uniform scaling/replacement fill features to ensure consistent multi-size exports"],
                ]}
              ]
            },
            {title:['图片填充修改','alter image fill'],
              layout:[
                {set:[],items:[
                  ["p",
                  "图片填充修改页提供按行列/宫格切分长图、批量统一缩放/替换填充等功能, 确保多规格导出一致",
                  "The Alter Image Fill page provides row/column or nine-grid slicing for long pages, batch uniform scaling/replacement fill features to ensure consistent multi-size exports"],
                ]}
              ]
            },
            {title:['拆分文本','split text'],
              layout:[
                {set:[],items:[
                  ["p",
                  "拆分文本页提供按行/词/字符拆分文本、反向合并、多选图层一键对齐等功能, 便于切换排版策略",
                  "The Split Text page provides text splitting by line/word/character, reverse merging, and one-click alignment for multiple layer selection for alternative layout strategies"],
                ]}
              ]
            },
            {title:['合并文本','merge text'],
              layout:[
                {set:[],items:[
                  ["p",
                  "合并文本页提供按行/词/字符拆分文本、反向合并、多选图层一键对齐等功能, 便于切换排版策略",
                  "The Merge Text page provides text splitting by line/word/character, reverse merging, and one-click alignment for multiple layer selection for alternative layout strategies"],
                ]}
              ]
            },
            {title:['图层&布局','layers layout'],
              layout:[
                {set:[],items:[
                  ["p",
                  "图层&布局页提供按行列/宫格切分长图、批量统一缩放/替换填充等功能, 确保多规格导出一致",
                  "The Layers Layout page provides row/column or nine-grid slicing for long pages, batch uniform scaling/replacement fill features to ensure consistent multi-size exports"],
                ]}
              ]
            },
            {title:['提取路径','get path'],
              layout:[
                {set:[],items:[
                  ["p",
                  "提取路径页提供按行列/宫格切分长图、批量统一缩放/替换填充等功能, 确保多规格导出一致",
                  "The Get Path page provides row/column or nine-grid slicing for long pages, batch uniform scaling/replacement fill features to ensure consistent multi-size exports"],
                ]}
              ]
            },
            {title:['获取可编辑SVG','get editable SVG'],
              layout:[
                {set:[],items:[
                  ["p",
                  "获取可编辑SVG页提供按行列/宫格切分长图、批量统一缩放/替换填充等功能, 确保多规格导出一致",
                  "The Get Editable SVG page provides row/column or nine-grid slicing for long pages, batch uniform scaling/replacement fill features to ensure consistent multi-size exports"],
                ]}
              ]
            },
          ]
        },
        data_to_layer:{
          name:['数据转图层','data to layer'],
          type:['算法','algorithm'],
          help:[
            ['p',
            '数据转图层算法从表格数据转为图层节点, 实现设计资产的批量创建。算法解析表格数据(CSV/XLS/XLSX), 将每行数据转换为画板或图层, 支持命名、尺寸、样式等属性的批量设置。createFrame根据表格数据创建画板, createImage处理图片数据创建图层, createZy解析兼容格式文件创建图层结构, 为设计系统搭建提供数据驱动的工作流',
            'Data to layer algorithm converts table data to layer nodes, enabling batch creation of design assets. Algorithm parses table data (CSV/XLS/XLSX), converts each row to frames or layers, supports batch setting of properties like name, size, style. createFrame creates frames from table data, createImage processes image data to create layers, createZy parses compatible format files to create layer structures, providing data-driven workflows for design system building'
            ]
          ],
          list:[
            {title:['从兼容格式创建','createZy'],
              layout:[
                {set:[],items:[
                  ["p",
                  "从兼容格式文件创建图层结构",
                  "Creates layer structures from compatible format files"],
                ]}
              ]
            },
            {title:['表格文本转数组','tableTextToArray'],
              layout:[
                {set:[],items:[
                  ["p",
                  "表格文本转数组, 支持行列转换",
                  "Converts table text to array, supports row/column conversion"],
                ]}
              ]
            },
            {title:['表格数组转对象组','tableArrayToObj'],
              layout:[
                {set:[],items:[
                  ["p",
                  "表格数组转对象组, 便于数据映射",
                  "Converts table array to object group for data mapping"],
                ]}
              ]
            }
          ],
          code:[
            {
              language:'javascript',
              code:``
            }
          ]
        },
        batch_modify:{
          name:['批量修改','batch modify'],
          type:['算法','algorithm'],
          help:[
            ['p',
            '批量修改算法从表格数据批量修改图层节点, 实现设计资产的快速迭代。算法支持名称映射(mapName)、文本映射(mapText)、组件属性映射(mapPro)和标签属性映射(mapTag)四种模式。通过表格数据与图层顺序的对应关系, 批量更新图层的名称、文本内容、组件属性值和标签样式, 支持自动克隆和自动减少行数, 为设计系统维护提供高效的数据驱动方案',
            'Batch modification algorithm batch modifies layer nodes from table data, enabling rapid iteration of design assets. Algorithm supports four modes: name mapping (mapName), text mapping (mapText), component property mapping (mapPro) and tag property mapping (mapTag). Through correspondence between table data and layer order, batch updates layer names, text content, component property values and tag styles, supports auto clone and auto reduce rows, providing efficient data-driven solutions for design system maintenance'
            ]
          ],
          list:[
            {title:['名称映射','mapName'],
              layout:[
                {set:[],items:[
                  ["p",
                  "名称映射, 批量修改图层名称",
                  "Name mapping, batch modifies layer names"],
                ]}
              ]
            },
            {title:['文本映射','mapText'],
              layout:[
                {set:[],items:[
                  ["p",
                  "文本映射, 批量修改文本内容",
                  "Text mapping, batch modifies text content"],
                ]}
              ]
            },
            {title:['组件属性映射','mapPro'],
              layout:[
                {set:[],items:[
                  ["p",
                  "组件属性映射, 批量修改组件属性值",
                  "Component property mapping, batch modifies component property values"],
                ]}
              ]
            },
            {title:['标签属性映射','mapTag'],
              layout:[
                {set:[],items:[
                  ["p",
                  "标签属性映射, 批量修改标签样式属性",
                  "Tag property mapping, batch modifies tag style properties"],
                ]}
              ]
            },
            {title:['更新表格','reTableByArray'],
              layout:[
                {set:[],items:[
                  ["p",
                  "根据表格数据更新表格组件",
                  "Updates table components based on table data"],
                ]}
              ]
            }
          ],
          code:[
            {
              language:'javascript',
              code:``
            }
          ]
        },
        compatible_format:{
          name:['兼容格式','compatible format'],
          type:['算法','algorithm'],
          help:[
            ['p',
            '兼容格式算法搭建易于记录设计性文件可生成和解析的兼容格式, 实现设计资产的跨平台流转。核心算法MdToObj将Markdown格式解析为节点式对象结构, SvgToObj解析SVG文件提取图像节点, exportZyInfo导出为兼容格式。算法支持.zy/.md/.svg等格式的生成和解析, 将设计结构转换为可编辑的文本格式, 便于版本控制和协作, 为设计系统提供可追溯的资产记录方案',
            'Compatible format algorithm builds easy-to-record design file formats that can be generated and parsed, enabling cross-platform flow of design assets. Core algorithm MdToObj parses Markdown format into node-based object structure, SvgToObj parses SVG files to extract image nodes, exportZyInfo exports to compatible format. Algorithm supports generation and parsing of formats like .zy/.md/.svg, converts design structures to editable text formats, facilitates version control and collaboration, provides traceable asset recording solutions for design systems'
            ]
          ],
          list:[
            {title:['富文本转节点对象','MdToObj'],
              layout:[
                {set:[],items:[
                  ["p",
                  "Markdown转节点对象, 解析标题/列表/表格/代码块等结构",
                  "Markdown to node object, parses structures like headings/lists/tables/code blocks"],
                ]}
              ]
            },
            {title:['SVG转节点对象','SvgToObj'],
              layout:[
                {set:[],items:[
                  ["p",
                  "SVG转节点对象, 提取图像节点和属性",
                  "SVG to node object, extracts image nodes and attributes"],
                ]}
              ]
            },
            {title:['导出为兼容格式','exportZyInfo'],
              layout:[
                {set:[],items:[
                  ["p",
                  "导出为兼容格式, 支持设计结构的序列化",
                  "Exports to compatible format, supports design structure serialization"],
                ]}
              ]
            }
          ],
          code:[
            {
              language:'javascript',
              code:``
            }
          ]
        },
        batch_transform:{
          name:['批量变换','batch transform'],
          type:['算法','algorithm'],
          help:[
            ['p',
            '变换算法提供图层的几何变换功能, 支持缩放、斜切等变换操作。rescaleMix实现等比缩放, 支持统一缩放、按宽度缩放和按高度缩放, 根据中心点计算位置偏移。transformMix实现斜切拉伸, 通过正切值计算更新transform矩阵。这些算法为设计调整提供精确的变换控制',
            'Transform algorithm provides geometric transformation functions for layers, supports scaling, skewing and other transformations. rescaleMix implements uniform scaling, supports uniform/width/height scaling, calculates position offset by center point. transformMix implements skew stretching, updates transform matrix through tangent calculation. These algorithms provide precise transformation control for design adjustments'
            ]
          ],
          list:[
            {title:['等比缩放','rescaleMix'],
              layout:[
                {set:[],items:[
                  ["p",
                  "等比缩放, 支持统一/宽度/高度三种模式, 按中心点计算位置偏移",
                  "Uniform scaling, supports three modes (uniform/width/height), calculates position offset by center point"],
                ]}
              ]
            },
            {title:['斜切拉伸','transformMix'],
              layout:[
                {set:[],items:[
                  ["p",
                  "斜切拉伸变换, 通过正切计算更新transform矩阵",
                  "Skew stretching transformation, updates transform matrix through tangent calculation"],
                ]}
              ]
            }
          ],
          code:[
            {
              language:'javascript',
              code:``
            }
          ]
        },
        layout_organization:{
          name:['布局整理','layout organization'],
          type:['算法','algorithm'],
          help:[
            ['p',
            '布局整理算法按横竖比自动整理图层布局, 为设计工作流提供高效的排版辅助。核心算法layoutByRatio将图层按横版、竖版和方形分类, 以最大尺寸为基准进行行列布局, 支持最小到最大或最大到最小排序, 自动计算间距和位置, 帮助设计师快速整理设计稿',
            'Layout organization algorithm automatically arranges layer layout by aspect ratio, providing efficient layout assistance for design workflows. Core algorithm layoutByRatio categorizes layers by landscape, portrait and square, arranges in rows/columns based on max size, supports min-to-max or max-to-min sorting, automatically calculates spacing and positions, helping designers quickly organize design drafts'
            ]
          ],
          list:[
            {title:['自动重排','layoutByRatio'],
              layout:[
                {set:[],items:[
                  ["p",
                  "按横竖版和方形分类自动排列, 以最大尺寸为基准行列布局",
                  "Auto arrangement by landscape/portrait/square categories, row/column layout based on max size"],
                ]}
              ]
            },
            {title:['调换位置','Exchange Position'],
              layout:[
                {set:[],items:[
                  ["p",
                  "调换两个图层的位置，并考虑自动布局和位置中心点",
                  "Swaps positions of two layers, considering auto layout and position center"],
                ]}
              ]
            }
          ],
          code:[
            {
              language:'javascript',
              code:``
            }
          ]
        },
        file_export:{
          name:['文件导出','file export'],
          type:['算法','algorithm'],
          help:[
            ['p',
            '图片导出算法按指定大小导出图片, 支持多规格批量导出和压缩优化。核心算法CUT_AREA基于均匀裁切方案, 按指定倍率(4096/2048/1024)将大图切分为行列网格, 计算每个切片的宽高和坐标。exportImgInfo根据导出设置(SCALE/WIDTH/HEIGHT)计算目标尺寸, 支持PNG/JPG/WEBP格式, 集成压缩算法优化文件大小',
            'Image export algorithm exports images by specified size, supports batch export for multiple specifications and compression optimization. Core algorithm CUT_AREA uses uniform cutting scheme, slices large images into row/column grids by specified scale (4096/2048/1024), calculates width, height and coordinates for each slice. exportImgInfo calculates target size based on export settings (SCALE/WIDTH/HEIGHT), supports PNG/JPG/WEBP formats, integrates compression algorithms to optimize file size'
            ]
          ],
          list:[
            {title:['均匀裁切','CUT_AREA'],
              layout:[
                {set:[],items:[
                  ["p",
                  "均匀裁切方案, 计算行列网格切片的宽高和坐标",
                  "Uniform cutting scheme, calculates width, height and coordinates for row/column grid slices"],
                ]}
              ]
            },
            {title:['按目标尺寸导出','exportImgInfo'],
              layout:[
                {set:[],items:[
                  ["p",
                  "按导出设置计算目标尺寸并导出图片",
                  "Calculates target size by export settings and exports images"],
                ]}
              ]
            },
            {title:['图片压缩','CompressImage'],
              layout:[
                {set:[],items:[
                  ["p",
                  "图片压缩, 支持质量调整和格式转换",
                  "Image compression, supports quality adjustment and format conversion"],
                ]}
              ]
            },
            {title:['通过切片实现栅格化','toPixel'],
              layout:[
                {set:[],items:[
                  ["p",
                  "通过切片实现栅格化, 支持副本和覆盖模式",
                  "Implements rasterization through slicing, supports copy and overwrite modes"],
                ]}
              ]
            }
          ],
          code:[
            {
              language:'javascript',
              code:``
            }
          ]
        },
        text_processing:{
          name:['文本处理','text processing'],
          type:['算法','algorithm'],
          help:[
            ['p',
            '文本处理算法提供文本拆分和样式处理功能。splitText支持按行、按样式属性和按关键词拆分文本, 保持原有样式并自动创建布局容器。算法为文本排版和样式管理提供灵活的处理方案',
            'Text processing algorithm provides text splitting and style processing functions. splitText supports splitting text by line, style attributes and keywords, preserves original styles and automatically creates layout containers. Algorithm provides flexible processing solutions for text layout and style management'
            ]
          ],
          list:[
            {title:['文本拆分','splitText'],
              layout:[
                {set:[],items:[
                  ["p",
                  "文本拆分, 支持按行/样式属性/关键词拆分, 自动创建布局容器",
                  "Text splitting, supports splitting by line/style attributes/keywords, automatically creates layout containers"],
                ]}
              ]
            }
          ],
          code:[
            {
              language:'javascript',
              code:``
            }
          ]
        },
        vector_processing:{
          name:['矢量处理','vector processing'],
          type:['算法','algorithm'],
          help:[
            ['p',
            '矢量处理算法提供路径提取和SVG处理功能。Split Path通过解析vectorPaths数据拆分复合路径, 保留描边样式。Get SVG和Clone As SVG支持SVG代码的导出和重新导入, 为矢量图形的编辑和流转提供支持',
            'Vector processing algorithm provides path extraction and SVG processing functions. Split Path splits compound paths by parsing vectorPaths data, preserves stroke styles. Get SVG and Clone As SVG support export and re-import of SVG code, providing support for vector graphics editing and flow'
            ]
          ],
          list:[
            {title:['拆分复合路径','Split Path'],
              layout:[
                {set:[],items:[
                  ["p",
                  "拆分复合路径为独立路径, 保留描边样式, 支持布尔运算和分组",
                  "Splits compound paths into independent paths, preserves stroke styles, supports boolean operations and grouping"],
                ]}
              ]
            },
            {title:['导出SVG代码','Get SVG'],
              layout:[
                {set:[],items:[
                  ["p",
                  "导出SVG代码, 移除链接属性生成可编辑代码",
                  "Exports SVG code, removes link attributes to generate editable code"],
                ]}
              ]
            },
            {title:['以SVG克隆图层','Clone As SVG'],
              layout:[
                {set:[],items:[
                  ["p",
                  "以SVG克隆图层, 重新导入为可编辑矢量",
                  "Clones layers as SVG, re-imports as editable vectors"],
                ]}
              ]
            }
          ],
          code:[
            {
              language:'javascript',
              code:``
            }
          ]
        },
      },
      listease:{},
      vfontx:{},
  };
    
    this.allSearchPath = {
      toolsset:[],
      listease:[],
      vfontx:[],
    };
    // `toolsset` 是对象（key -> item），不能直接用 `map`
    Object.keys(this.doc.toolsset).forEach(key => {
      const items = this.doc.toolsset[key];
      if(!items) return;
      items.about = (items.help && items.help[0]) || ['p','',''];
      /*
      let preview = {
        title:['界面预览','Interface preview'],
        layout:[
          {set:[['class','df-cc'],['data-doc-iframe','']],items:[
            ["div",
            `<iframe src='../../tool_plugin/ToolsSetFig/test/index.html?page=${items.name[1]}&lan=zh'></iframe>`,
            `<iframe src='../../tool_plugin/ToolsSetFig/test/index.html?page=${items.name[1]}&lan=en'></iframe>`,
          ],
          ]}
        ]
      }
      items.list = [preview,...items.list]
      */
    });
  }

  //======直接修改======//
  creDocAll(parent,tool,type,search){
    let {isSearch = false, parentSearch = null} = search || {};
    //log(isSearch);
    let all = this.doc[tool];
    let num = 0;
    let keys = Object.keys(all);
    let realNum = 0;
    for(let i = 0; i < keys.length; i++){
      let key = keys[i];
      if(all[key].type[1] === type){
        //log(all[key].about);
        let page = parent.querySelector(`[data-page-name-en="${key.replace(/\_/g,' ')}"]`);
        if(!page) return;
        let topMix = document.createElement('div');
        topMix.setAttribute('data-doc-topmix','');

        let top = document.createElement('div');
        top.setAttribute('data-doc-title','');
        top.innerHTML = all[key].name[0];
        top.setAttribute('data-zh-text', all[key].name[0]);
        top.setAttribute('data-en-text', all[key].name[1]);
        topMix.appendChild(top);

        let about = document.createElement(all[key].about[0]);
        about.setAttribute('data-zh-text', this.toHighlight(all[key].about[1]));
        about.setAttribute('data-en-text', this.toHighlight(all[key].about[2]));
        about.innerHTML = this.toHighlight(all[key].about[1]);
        topMix.appendChild(about);

        page.appendChild(topMix);
        for(let ii = 0; ii < all[key].list.length; ii++){
          let list = all[key].list[ii];
          let index = ii;
          let card;
          if(isSearch){
            let paths = [
              [all[key].type[0],all[key].name[0],list.title[0]],
              [all[key].type[1],all[key].name[1],list.title[1]],
            ];
            this.allSearchPath[tool].push(
              {
                name:list.title,
                key:[...new Set([...list.title[0].replace(/[^\u4e00-\u9fa5]/g, '').split(''),...list.title[1].toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').split(' ')])].filter(item => item !== ''),
                path:paths.map(path => path.join(' > ')),
                id:all[key].type[1] + '_' + num,
              });
            card = this.creDocCard(list,[parentSearch,paths,all[key].type[1] + '_' + num],index);
            num++;
          } else {
            card = this.creDocCard(list,null,index);
          }
          page.appendChild(card);
          if(ii == all[key].list.length - 1){
            //this.allSearchPath[tool].sort((a,b) => a.name[0].localeCompare(b.name[0]));
          }
        };

        if(all[key].error){
          let error = this.creDocError(all[key].error);
          page.appendChild(error);
        };

        let tabsBottom = document.createElement('div');
        tabsBottom.setAttribute('data-doc-tabsbottom','');
        tabsBottom.className = 'df-sc w100';

        let before = document.createElement('div');
        let after = document.createElement('div');

        if(realNum > 0){
          let beforeKey = all[keys[i - 1]].name[0].replace(/\_/g,' ');
          let beforeKeyEn = all[keys[i - 1]].name[1].replace(/\_/g,' ');
          before = document.createElement('div');
          before.setAttribute('data-doc-tabsbottom-click',beforeKey);
          before.setAttribute('data-doc-tabsbottom-click-en',beforeKeyEn);
          before.setAttribute('data-zh-text','上一页');
          before.setAttribute('data-en-text','Previous page');
          before.innerHTML = '上一页';

          before.addEventListener('click',()=>{
            this.viewPage([all[key].type[1],beforeKeyEn]);
            page.parentNode.scrollTop = 0;
          });
        }

        if((keys[i + 1] && all[keys[i + 1]].type[1] === type) && i !== keys.length - 1){
          let afterKey = all[keys[i + 1]].name[0].replace(/\_/g,' ');
          let afterKeyEn = all[keys[i + 1]].name[1].replace(/\_/g,' ');
          after.setAttribute('data-doc-tabsbottom-click',afterKey);
          after.setAttribute('data-doc-tabsbottom-click-en',afterKeyEn);
          after.setAttribute('data-zh-text','下一页');
          after.setAttribute('data-en-text','Next page');
          after.innerHTML = '下一页';

          after.addEventListener('click',()=>{
            this.viewPage([all[key].type[1],afterKeyEn]);
            page.parentNode.scrollTop = 0;
          });
        }
        
        tabsBottom.appendChild(before);
        tabsBottom.appendChild(after);

        page.appendChild(tabsBottom);
        realNum++
      };
    }

  };

  creDocList(){
    //默认已经生成好了doc-card、data-search-turnto、data-page-name元素
    //每生成一个radio就绑定一下data-search-turnto的view和doc-card的悬停事件
    let language = ROOT.getAttribute('data-language');
    let tabs = document.querySelectorAll('[data-tab-sec]');//被标记为需要填充二级元素的元素
    let cards = document.querySelectorAll('[data-doc-card]');
    let logs = document.querySelectorAll('[data-doc-log]');
    //默认在生成时先排序一次搜索标签，后面监听language再排序；
    this.reSortSearch();
    //先在tab后添加radio容器，由css控制显隐
    for(let tabBox of tabs){
      let tabLabel = tabBox.querySelectorAll('label');
      for(let label of tabLabel){
        let radioBox = document.createElement('div');
        radioBox.className = 'df-ffc gap4';
        radioBox.setAttribute('data-doc-radiobox',label.getAttribute('for'));
        radioBox.setAttribute('data-radio-value','');
        label.parentNode.insertBefore(radioBox,label.nextSibling);
      };
    };
    for(let card of [...cards,...logs]){
      let radioBox = document.querySelector(`[data-doc-radiobox="tab_${card.parentNode.getAttribute('data-page-name-en')}_0"]`);
      let radio = document.createElement('div');
      radio.setAttribute('data-radio','');
      radio.setAttribute('data-radio-main','false');
      if(card.getAttribute('data-doc-card') == '0'){
        radio.setAttribute('data-radio-main','true');
      }
      let textEn = card.querySelector('[data-doc-title]').getAttribute('data-en-text');
      let textZh = card.querySelector('[data-doc-title]').getAttribute('data-zh-text');
      radio.setAttribute('data-radio-data',textEn);
      radio.setAttribute('data-zh-text',textZh);
      radio.setAttribute('data-en-text',textEn);
      radio.innerHTML = language == 'Zh' ? textZh : textEn;
      radioBox.appendChild(radio);
      radio.addEventListener('click',()=>{
        //let path = card.getAttribute('data-search-path');
        //this.viewCard(path)
        card.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      });
    };
  };

  crePluginAll(parent,tool,key){
  };

  //======返回节点======//
  creDocCard(list,searchs,index){
    //log(list);
    let card = document.createElement('div');
    card.setAttribute('data-doc-card',index);
    card.style.animationDelay = index* 0.1 + 's';
    let title = document.createElement('div');
    title.setAttribute('data-doc-title','');
    title.innerHTML = this.toHighlight(list.title[0]);
    title.setAttribute('data-zh-text', this.toHighlight(list.title[0]));
    title.setAttribute('data-en-text', this.toHighlight(list.title[1]));

    card.appendChild(title);
    list.layout.forEach(item => {
      let linemix = document.createElement('div');
      linemix.setAttribute('data-doc-linemix','');
      item.items.forEach(items => {
        let line = document.createElement(items[0]);
        line.setAttribute('data-doc-line',items[0]);
        item.set.forEach(set => {
          line.setAttribute(set[0],set[1]);
        });
        let span;
        if(items[0] == 'div'){
          span = line;
        }else{
          span = document.createElement('span');
          line.appendChild(span);
        }
        if(items[0] == 'li'){
          line.setAttribute('data-li-style','2');
        }
        
        span.innerHTML = this.toHighlight(items[1]);
        span.setAttribute('data-zh-text', this.toHighlight(items[1]));
        span.setAttribute('data-en-text', this.toHighlight(items[2]));
        
        linemix.appendChild(line);
      });
      card.appendChild(linemix);
    });

    if(searchs){
      this.creDocSearch(searchs);
    };

    card.setAttribute('data-search-path',searchs[1][1].join(' > '));
    card.addEventListener('mouseenter',()=>{
      let radioBox = document.querySelector(`[data-doc-radiobox="tab_${searchs[1][1][1]}_0"]`);
      if(!radioBox) return;
      radioBox.children[index].click();
    });
    return card;
  };


  creDocCode(code){
    let codeBox = document.createElement('code');
    codeBox.setAttribute('data-doc-code','');
    codeBox.innerHTML = code;
    Prism.highlightElement(codeBox);
    return codeBox;
  };

  creDocError(error){
    let errorBox = document.createElement('div');
    errorBox.setAttribute('data-doc-error','');
    let text = ['常见错误','Common errors'];
    let title = document.createElement('div');
    title.setAttribute('data-doc-title','');
    title.innerHTML = text[0];;
    title.setAttribute('data-zh-text', this.toHighlight(text[0]));
    title.setAttribute('data-en-text', this.toHighlight(text[1]));

    errorBox.appendChild(title);
    
    error.forEach(item => {
      let line = document.createElement('li');
      line.setAttribute('data-li-style','1');
      line.innerHTML = this.toHighlight(item[0]);
      line.setAttribute('data-zh-text', this.toHighlight(item[0]));
      line.setAttribute('data-en-text', this.toHighlight(item[1]));
      errorBox.appendChild(line);
    });
    return errorBox;
  };

  crePluginHelp(key){
    let help = key.help;

    help.forEach(item => {
      let line = document.createElement(item[0]);
      let span = document.createElement('span');
      span.innerHTML = this.toHighlight(item[1]);
      span.setAttribute('data-en-text', this.toHighlight(item[2]));
      line.appendChild(span);
      parent.appendChild(line);
    });
    return innerHTML;
  };

  creDocSearch(searchs){

    let [parent,paths,id] = searchs;
    let turnto = document.createElement('div');
    turnto.setAttribute('data-search-turnto',id);
    turnto.className = 'df-sc';

    let info = document.createElement('div');
    info.setAttribute('data-scroll','');
    info.className = 'df-ffc fl1 scrollbar';
    info.innerHTML = `
    <div data-search-name class="df-lc"
      data-zh-text="${paths[0][2]}" 
      data-en-text="${paths[1][2]}">
        ${paths[0][2]}
      </div>
      <div data-search-path 
      data-zh-text="${paths[0].join(' > ')}" 
      data-en-text="${paths[1].join(' > ')}">
        ${paths[0].join(' > ')}
    </div>
    `;
    turnto.appendChild(info);
    let btn = document.createElement('div');
    btn.className = 'df-cc'
    btn.setAttribute('data-btn','op');
    btn.setAttribute('data-zh-text','前往');
    btn.setAttribute('data-en-text','View');
    btn.textContent = '前往';
    btn.onclick = ()=>{
      this.viewPage(paths[1]);
    };
    turnto.appendChild(btn);
    parent.appendChild(turnto);
  }

  //======返回数据======//

  toHighlight(text){
    return text
      .replace(/\/\+\+/g, '<span data-highlight>')
      .replace(/\+\+\//g, '</span>');
  };

  //======工具函数======//
  viewPage(paths){
    //log(paths);
    let input1 = getElementMix(`tab_${paths[0]}_0`);
    let input2 = getElementMix(`tab_${paths[1]}_0`);
    if(!input1 || !input2) return;
    let inputEvent1 = new Event('change',{bubbles:true});
    let inputEvent2 = new Event('change',{bubbles:true});
    input1.dispatchEvent(inputEvent1);
    input2.dispatchEvent(inputEvent2);
  };

  viewCard(path){
    let card = document.querySelector(`[data-search-path="${path}"]`);
    if(card){
      card.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  };

  //{title['',''],date:'',items:['','']}
  addLog(parent,logs){
    //log(logs);
    logs.forEach(log => {
      let logBox = document.createElement('div');
      logBox.setAttribute('data-doc-log','');
      let title = document.createElement('div');
      title.setAttribute('data-doc-title','');
      title.innerHTML = log.title[0];
      title.setAttribute('data-zh-text', this.toHighlight(log.title[0]));
      title.setAttribute('data-en-text', this.toHighlight(log.title[1]));
      logBox.appendChild(title);
      let date = document.createElement('div');
      date.setAttribute('data-doc-date','');
      date.innerHTML = log.date;
      logBox.appendChild(date);

      // code blocks need safe escaping (language switch uses innerHTML)
      const escapeHTML = (text) => {
        return String(text ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      };
      
      log.items.forEach(item => {
        // 结构约定：['code', lang, codeText]
        // code 块不参与中英文切换
        // （兼容旧结构：['code', lang, zhCode, enCode]）
        if(item[0] == 'code'){
          let lang = item[1] || '';
          let codeText = item[2] ?? '';

          let codeCard = document.createElement('div');
          codeCard.setAttribute('data-codecard','');
          
          let box = document.createElement('div');
          box.setAttribute('data-resize','pre');

          let pre = document.createElement('pre');
          pre.setAttribute('data-doc-line','code');
          let code = document.createElement('code');
          if(lang){
            code.className = `language-${lang}`;
          }
          // 用 textContent 保证内容安全，Prism 会自行写入高亮后的 innerHTML
          code.textContent = String(codeText ?? '');
          pre.appendChild(code);
          box.appendChild(pre);
          codeCard.appendChild(box);
          logBox.appendChild(codeCard);
          return;
        }

        let line = document.createElement(item[0]);
        line.setAttribute('data-doc-line',item[0]);
        if(item[0] == 'li'){
          line.setAttribute('data-li-style','2');
        }
        let span = document.createElement('span');
        span.innerHTML = this.toHighlight(item[1]);
        span.setAttribute('data-zh-text', this.toHighlight(item[1]));
        span.setAttribute('data-en-text', this.toHighlight(item[2]));
        line.appendChild(span);
        logBox.appendChild(line);
      });
      parent.appendChild(logBox);
    });
  };

  reSortSearch(){
    let searchs = Array.from(document.querySelectorAll('[data-search-turnto]'));
    //重排data-search-turnto元素,用textContent可以按当前语言排序
    searchs.sort((a,b) => a.querySelector('[data-search-name]').textContent.localeCompare(b.querySelector('[data-search-name]').textContent));
    let fragment = document.createDocumentFragment();
    for(let search of searchs){
      fragment.appendChild(search);
    };
    document.querySelector('[data-dailogsearch-box]').appendChild(fragment);
  };
}



