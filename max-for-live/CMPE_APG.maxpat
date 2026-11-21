{
  "patcher": {
    "fileversion": 1,
    "appversion": {
      "major": 8,
      "minor": 6,
      "revision": 5,
      "architecture": "x64",
      "modernui": 1
    },
    "classnamespace": "box",
    "rect": [
      80,
      80,
      1100,
      169
    ],
    "openinpresentation": 1,
    "default_fontsize": 11.0,
    "default_fontface": 0,
    "default_fontname": "Arial",
    "bgcolor": [
      0.9529411764705882,
      0.9647058823529412,
      0.9725490196078431,
      1.0
    ],
    "bglockedcolor": [
      0.9529411764705882,
      0.9647058823529412,
      0.9725490196078431,
      1.0
    ],
    "title": "CMPE · APG 0.1.0",
    "boxes": [
      {
        "box": {
          "id": "title",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            12,
            470,
            38
          ],
          "fontname": "Arial",
          "fontsize": 18.0,
          "textcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "text": "CMPE · APG",
          "presentation": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "fontface": 1,
          "varname": "title",
          "presentation_rect": [
            8,
            10,
            128,
            27
          ],
          "hidden": 0,
          "linecount": 1
        }
      },
      {
        "box": {
          "id": "subtitle",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            26,
            54,
            420,
            25
          ],
          "fontname": "Arial",
          "fontsize": 12.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "Audio palindrome",
          "presentation": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "hidden": 0,
          "presentation_rect": [
            8,
            42,
            128,
            32
          ],
          "linecount": 2
        }
      },
      {
        "box": {
          "id": "demo_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            512,
            16,
            88,
            30
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "LOAD DEMO",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "varname": "demo_button",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 4,
          "bgcolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "bgoncolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "textoncolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "textovercolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Load the included demonstration samples. This replaces the current sources.",
          "presentation_rect": [
            8,
            78,
            124,
            22
          ],
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "header_rule",
          "maxclass": "panel",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            85,
            792,
            1
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "presentation": 0,
          "bgcolor": [
            0.81,
            0.81,
            0.81,
            1.0
          ],
          "border": 0,
          "rounded": 0,
          "ignoreclick": 1,
          "hidden": 1
        }
      },
      {
        "box": {
          "id": "output_rule",
          "maxclass": "panel",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            280,
            792,
            1
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "presentation": 0,
          "bgcolor": [
            0.81,
            0.81,
            0.81,
            1.0
          ],
          "border": 0,
          "rounded": 0,
          "ignoreclick": 1,
          "hidden": 1
        }
      },
      {
        "box": {
          "id": "credit_rule",
          "maxclass": "panel",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            800,
            912,
            1
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "presentation": 0,
          "bgcolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "border": 0,
          "rounded": 0,
          "ignoreclick": 1,
          "varname": "credit_rule"
        }
      },
      {
        "box": {
          "id": "source_label1",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            246,
            154,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "text": "SAMPLE 1",
          "presentation": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "fontface": 1,
          "varname": "source_label1",
          "hidden": 0,
          "presentation_rect": [
            148,
            10,
            145,
            16
          ],
          "linecount": 1
        }
      },
      {
        "box": {
          "id": "load1",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            208,
            240,
            104,
            32
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "LOAD",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "varname": "load1",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 4,
          "bgcolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "bgoncolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "textoncolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "textovercolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose a mono or stereo WAV or AIFF for sample 1.",
          "hidden": 0,
          "presentation_rect": [
            300,
            18,
            48,
            24
          ]
        }
      },
      {
        "box": {
          "id": "file1",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            278,
            288,
            40
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "No sample loaded",
          "presentation": 1,
          "varname": "file1",
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "linecount": 2,
          "hidden": 0,
          "presentation_rect": [
            148,
            26,
            148,
            28
          ]
        }
      },
      {
        "box": {
          "id": "repeat_label1",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            324,
            138,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "Sample 1 repeats",
          "presentation": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "varname": "repeat_label1",
          "hidden": 0,
          "presentation_rect": [
            360,
            9,
            78,
            27
          ],
          "linecount": 2
        }
      },
      {
        "box": {
          "id": "repeat1",
          "maxclass": "number",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            24,
            350,
            138,
            30
          ],
          "fontname": "Arial",
          "fontsize": 15.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "presentation": 1,
          "varname": "repeat1",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "hbgcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "triangle": 0,
          "parameter_enable": 1,
          "minimum": 1,
          "maximum": 20,
          "hidden": 0,
          "presentation_rect": [
            360,
            37,
            78,
            26
          ],
          "bgcolor2": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "numdecimalplaces": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "Sample 1 Repeats",
              "parameter_shortname": "Rep 1",
              "parameter_type": 1,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                3
              ],
              "parameter_invisible": 0,
              "parameter_order": 1,
              "parameter_unitstyle": 0,
              "parameter_defer": 1,
              "parameter_mmin": 1,
              "parameter_mmax": 20
            }
          }
        }
      },
      {
        "box": {
          "id": "source_label2",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            336,
            246,
            154,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.19215686274509805,
            0.37254901960784315,
            0.6509803921568628,
            1.0
          ],
          "text": "SAMPLE 2",
          "presentation": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "fontface": 1,
          "varname": "source_label2",
          "hidden": 0,
          "presentation_rect": [
            148,
            54,
            145,
            16
          ],
          "linecount": 1
        }
      },
      {
        "box": {
          "id": "load2",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            520,
            240,
            104,
            32
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "LOAD",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "varname": "load2",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 4,
          "bgcolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "bgoncolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "textoncolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "textovercolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose a mono or stereo WAV or AIFF for sample 2.",
          "hidden": 0,
          "presentation_rect": [
            300,
            62,
            48,
            24
          ]
        }
      },
      {
        "box": {
          "id": "file2",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            336,
            278,
            288,
            40
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "No sample loaded",
          "presentation": 1,
          "varname": "file2",
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "linecount": 2,
          "hidden": 0,
          "presentation_rect": [
            148,
            70,
            148,
            28
          ]
        }
      },
      {
        "box": {
          "id": "repeat_label2",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            336,
            324,
            138,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "Sample 2 repeats",
          "presentation": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "varname": "repeat_label2",
          "hidden": 0,
          "presentation_rect": [
            446,
            9,
            78,
            27
          ],
          "linecount": 2
        }
      },
      {
        "box": {
          "id": "repeat2",
          "maxclass": "number",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            336,
            350,
            138,
            30
          ],
          "fontname": "Arial",
          "fontsize": 15.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "presentation": 1,
          "varname": "repeat2",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "hbgcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "triangle": 0,
          "parameter_enable": 1,
          "minimum": 1,
          "maximum": 20,
          "hidden": 0,
          "presentation_rect": [
            446,
            37,
            78,
            26
          ],
          "bgcolor2": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "numdecimalplaces": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "Sample 2 Repeats",
              "parameter_shortname": "Rep 2",
              "parameter_type": 1,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                4
              ],
              "parameter_invisible": 0,
              "parameter_order": 1,
              "parameter_unitstyle": 0,
              "parameter_defer": 1,
              "parameter_mmin": 1,
              "parameter_mmax": 20
            }
          }
        }
      },
      {
        "box": {
          "id": "source_label3",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            648,
            246,
            154,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.4470588235294118,
            0.3411764705882353,
            0.6509803921568628,
            1.0
          ],
          "text": "SAMPLE 3",
          "presentation": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "fontface": 1,
          "varname": "source_label3",
          "hidden": 0,
          "presentation_rect": [
            148,
            98,
            145,
            16
          ],
          "linecount": 1
        }
      },
      {
        "box": {
          "id": "load3",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            832,
            240,
            104,
            32
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "LOAD",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "varname": "load3",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 4,
          "bgcolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "bgoncolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "textoncolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "textovercolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose a mono or stereo WAV or AIFF for sample 3.",
          "hidden": 0,
          "presentation_rect": [
            300,
            106,
            48,
            24
          ]
        }
      },
      {
        "box": {
          "id": "file3",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            648,
            278,
            288,
            40
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "No sample loaded",
          "presentation": 1,
          "varname": "file3",
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "linecount": 2,
          "hidden": 0,
          "presentation_rect": [
            148,
            114,
            148,
            28
          ]
        }
      },
      {
        "box": {
          "id": "repeat_label3",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            648,
            324,
            138,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "Sample 3 repeats",
          "presentation": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "varname": "repeat_label3",
          "hidden": 0,
          "presentation_rect": [
            532,
            9,
            78,
            27
          ],
          "linecount": 2
        }
      },
      {
        "box": {
          "id": "repeat3",
          "maxclass": "number",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            648,
            350,
            138,
            30
          ],
          "fontname": "Arial",
          "fontsize": 15.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "presentation": 1,
          "varname": "repeat3",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "hbgcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "triangle": 0,
          "parameter_enable": 1,
          "minimum": 1,
          "maximum": 20,
          "hidden": 0,
          "presentation_rect": [
            532,
            37,
            78,
            26
          ],
          "bgcolor2": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "numdecimalplaces": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "Sample 3 Repeats",
              "parameter_shortname": "Rep 3",
              "parameter_type": 1,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                5
              ],
              "parameter_invisible": 0,
              "parameter_order": 1,
              "parameter_unitstyle": 0,
              "parameter_defer": 1,
              "parameter_mmin": 1,
              "parameter_mmax": 20
            }
          }
        }
      },
      {
        "box": {
          "id": "pitch_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            174,
            324,
            138,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "Pitch range",
          "presentation": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "varname": "pitch_label",
          "hidden": 0,
          "presentation_rect": [
            360,
            74,
            78,
            27
          ],
          "linecount": 2
        }
      },
      {
        "box": {
          "id": "pitch",
          "maxclass": "flonum",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            174,
            350,
            138,
            30
          ],
          "fontname": "Arial",
          "fontsize": 15.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "presentation": 1,
          "varname": "pitch",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "hbgcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "triangle": 0,
          "parameter_enable": 1,
          "minimum": 0,
          "maximum": 1,
          "format": 6,
          "hidden": 0,
          "presentation_rect": [
            360,
            102,
            78,
            26
          ],
          "bgcolor2": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "numdecimalplaces": 2,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "Pitch Range",
              "parameter_shortname": "Pitch",
              "parameter_type": 0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.5
              ],
              "parameter_invisible": 0,
              "parameter_order": 1,
              "parameter_unitstyle": 1,
              "parameter_defer": 1,
              "parameter_mmin": 0,
              "parameter_mmax": 1
            }
          }
        }
      },
      {
        "box": {
          "id": "monitor_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            592,
            394,
            116,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "Output dB",
          "presentation": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "varname": "monitor_label",
          "presentation_rect": [
            906,
            110,
            88,
            21
          ],
          "hidden": 0,
          "linecount": 1
        }
      },
      {
        "box": {
          "id": "monitor_level",
          "maxclass": "flonum",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            712,
            390,
            96,
            30
          ],
          "fontname": "Arial",
          "fontsize": 15.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "presentation": 1,
          "varname": "monitor_level",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "hbgcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "triangle": 0,
          "parameter_enable": 1,
          "minimum": -60,
          "maximum": 0,
          "format": 6,
          "presentation_rect": [
            1002,
            106,
            88,
            26
          ],
          "hidden": 0,
          "bgcolor2": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "numdecimalplaces": 1,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "Output Level",
              "parameter_shortname": "Output",
              "parameter_type": 0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                -12
              ],
              "parameter_invisible": 0,
              "parameter_order": 1,
              "parameter_unitstyle": 4,
              "parameter_defer": 1,
              "parameter_mmin": -60,
              "parameter_mmax": 0
            }
          }
        }
      },
      {
        "box": {
          "id": "meter_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            568,
            242,
            96,
            26
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "LEVEL",
          "presentation": 0,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "hidden": 1
        }
      },
      {
        "box": {
          "id": "meter_L",
          "maxclass": "meter~",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            832,
            390,
            104,
            12
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "outlettype": [
            "float"
          ],
          "presentation": 1,
          "bgcolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "offcolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "oncolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "monotone": 1,
          "orientation": 1,
          "varname": "meter_L",
          "presentation_rect": [
            906,
            140,
            184,
            7
          ],
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "meter_R",
          "maxclass": "meter~",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            832,
            408,
            104,
            12
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "outlettype": [
            "float"
          ],
          "presentation": 1,
          "bgcolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "offcolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "oncolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "monotone": 1,
          "orientation": 1,
          "varname": "meter_R",
          "presentation_rect": [
            906,
            153,
            184,
            7
          ],
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "output_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            394,
            220,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "OUTPUT",
          "presentation": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "fontface": 1,
          "varname": "output_label",
          "presentation_rect": [
            624,
            9,
            100,
            16
          ],
          "hidden": 0,
          "linecount": 1
        }
      },
      {
        "box": {
          "id": "duration",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            260,
            394,
            260,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "Not generated",
          "presentation": 1,
          "varname": "duration",
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "presentation_rect": [
            734,
            9,
            160,
            16
          ],
          "hidden": 0,
          "linecount": 1
        }
      },
      {
        "box": {
          "id": "time",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            704,
            578,
            232,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "0.0 s",
          "presentation": 0,
          "varname": "time",
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "textjustification": 2
        }
      },
      {
        "box": {
          "id": "channel_l",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            450,
            28,
            25
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "L",
          "presentation": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "fontface": 1,
          "varname": "channel_l",
          "hidden": 0,
          "presentation_rect": [
            624,
            37,
            12,
            16
          ],
          "linecount": 1
        }
      },
      {
        "box": {
          "id": "wave_l",
          "maxclass": "waveform~",
          "numinlets": 5,
          "numoutlets": 6,
          "patching_rect": [
            56,
            430,
            880,
            66
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "outlettype": [
            "float",
            "float",
            "float",
            "float",
            "list",
            "list"
          ],
          "presentation": 1,
          "varname": "wave_l",
          "buffername": "apgw_out_init",
          "chanoffset": 1,
          "allowdrag": 0,
          "setmode": 1,
          "setunit": 0,
          "labels": 0,
          "quiet": 0,
          "outmode": 4,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "waveformcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "gridcolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "selectioncolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            0.18
          ],
          "vzoom": 1.0,
          "voffset": 0.0,
          "hint": "Drag across the waveform to choose a playback or loop range.",
          "hidden": 0,
          "presentation_rect": [
            640,
            29,
            254,
            33
          ],
          "fgcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "bordercolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "channel_r",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            524,
            28,
            25
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "R",
          "presentation": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "fontface": 1,
          "varname": "channel_r",
          "hidden": 0,
          "presentation_rect": [
            624,
            78,
            12,
            16
          ],
          "linecount": 1
        }
      },
      {
        "box": {
          "id": "wave_r",
          "maxclass": "waveform~",
          "numinlets": 5,
          "numoutlets": 6,
          "patching_rect": [
            56,
            504,
            880,
            66
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "outlettype": [
            "float",
            "float",
            "float",
            "float",
            "list",
            "list"
          ],
          "presentation": 1,
          "varname": "wave_r",
          "buffername": "apgw_out_init",
          "chanoffset": 2,
          "allowdrag": 0,
          "setmode": 1,
          "setunit": 0,
          "labels": 0,
          "quiet": 0,
          "outmode": 4,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "waveformcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "gridcolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "selectioncolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            0.18
          ],
          "vzoom": 1.0,
          "voffset": 0.0,
          "hint": "Drag across the waveform to choose a playback or loop range.",
          "hidden": 0,
          "presentation_rect": [
            640,
            70,
            254,
            33
          ],
          "fgcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "bordercolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "selection_info",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            578,
            660,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "Drag across the waveform to select a range.",
          "presentation": 0,
          "varname": "selection_info",
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "loop_toggle",
          "maxclass": "toggle",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            24,
            616,
            24,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "outlettype": [
            "int"
          ],
          "presentation": 1,
          "varname": "loop_toggle",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "checkedcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "uncheckedcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "parameter_enable": 1,
          "hint": "Loop the selected waveform range. FULL restores the complete generated result.",
          "hidden": 0,
          "presentation_rect": [
            624,
            114,
            18,
            18
          ],
          "minimum": 0,
          "maximum": 1,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "Loop Selection",
              "parameter_shortname": "Loop",
              "parameter_type": 1,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0
              ],
              "parameter_invisible": 0,
              "parameter_order": 1,
              "parameter_unitstyle": 0,
              "parameter_defer": 1,
              "parameter_mmin": 0,
              "parameter_mmax": 1
            }
          },
          "annotation": "Loop the selected waveform range. FULL restores the complete generated result."
        }
      },
      {
        "box": {
          "id": "loop_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            60,
            614,
            320,
            28
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "Loop",
          "presentation": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "varname": "loop_label",
          "hidden": 0,
          "presentation_rect": [
            648,
            114,
            41,
            18
          ],
          "linecount": 1
        }
      },
      {
        "box": {
          "id": "clear_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            520,
            610,
            194,
            34
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "FULL RANGE",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "varname": "clear_button",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 4,
          "bgcolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "bgoncolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "textoncolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "textovercolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Reset the selected range to the entire rendered piece.",
          "hidden": 0,
          "presentation_rect": [
            696,
            110,
            86,
            24
          ]
        }
      },
      {
        "box": {
          "id": "save_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            730,
            610,
            206,
            34
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "SAVE WAV",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "varname": "save_button",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 4,
          "bgcolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "bgoncolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "textoncolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "textovercolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Save the complete rendered piece as a WAV file.",
          "hidden": 0,
          "presentation_rect": [
            790,
            110,
            104,
            24
          ]
        }
      },
      {
        "box": {
          "id": "play_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            24,
            654,
            448,
            48
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "text": "PLAY",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "varname": "play_button",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 4,
          "bgcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "bgoncolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "textoncolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "textovercolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "parameter_enable": 0,
          "fontface": 1,
          "hint": "Start the selected instrument or play its rendered result.",
          "presentation_rect": [
            906,
            45,
            88,
            28
          ],
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "stop_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            488,
            654,
            216,
            48
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.5450980392156862,
            0.2,
            0.2196078431372549,
            1.0
          ],
          "text": "STOP",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "varname": "stop_button",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 4,
          "bgcolor": [
            0.9607843137254902,
            0.9019607843137255,
            0.8980392156862745,
            1.0
          ],
          "bgoncolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "textoncolor": [
            0.5450980392156862,
            0.2,
            0.2196078431372549,
            1.0
          ],
          "textovercolor": [
            0.5450980392156862,
            0.2,
            0.2196078431372549,
            1.0
          ],
          "parameter_enable": 0,
          "active": 1,
          "hint": "Stop audio or cancel preparation.",
          "presentation_rect": [
            1002,
            45,
            88,
            28
          ],
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "new_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            720,
            654,
            216,
            48
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "GENERATE",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "varname": "new_button",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 4,
          "bgcolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "bgoncolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "textoncolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "textovercolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Start a fresh result for the selected instrument.",
          "presentation_rect": [
            906,
            10,
            184,
            28
          ],
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "progress",
          "maxclass": "slider",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            24,
            712,
            912,
            6
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "outlettype": [
            ""
          ],
          "presentation": 1,
          "varname": "progress",
          "floatoutput": 1,
          "size": 1.0,
          "min": 0.0,
          "mult": 1.0,
          "inputrangemode": 1,
          "orientation": 1,
          "ignoreclick": 1,
          "parameter_enable": 0,
          "bgcolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "elementcolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "knobcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "knobshape": 0,
          "presentation_rect": [
            624,
            137,
            270,
            3
          ],
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "render_info",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            724,
            912,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "Starting...",
          "presentation": 0,
          "varname": "render_info",
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "status",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            752,
            912,
            38
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "Ready. Load samples or choose LOAD DEMO.",
          "presentation": 1,
          "varname": "status",
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "linecount": 1,
          "presentation_rect": [
            148,
            147,
            746,
            17
          ],
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "original_credit",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            810,
            620,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "Original: Joo Won Park",
          "presentation": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "varname": "original_credit",
          "presentation_rect": [
            8,
            103,
            128,
            16
          ],
          "hidden": 0,
          "linecount": 1
        }
      },
      {
        "box": {
          "id": "original_link",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            668,
            806,
            268,
            32
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "text": "Original CMPE",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "varname": "original_link",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 4,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "bgoncolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "textoncolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "textovercolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Open Joo Won Park's original Computer Music Practice Examples.",
          "presentation_rect": [
            8,
            122,
            124,
            21
          ],
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "original_url",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1320,
            600,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "; max launchbrowser https://joowonpark.net/cmpe/",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "open1",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            24,
            850,
            225,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "opendialog WAVE AIFF",
          "outlettype": [
            "",
            "bang"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "path1",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            24,
            890,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend loadfile 0",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "repeats1",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            24,
            930,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend repeats 0",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "source1",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            24,
            990,
            225,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "buffer~ apgw_init1",
          "outlettype": [
            "float",
            "bang"
          ],
          "varname": "source1",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "loaded_defer1",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            24,
            1030,
            90,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "deferlow",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "loaded_msg1",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            24,
            1070,
            110,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "loaded 0",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "open2",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            340,
            850,
            225,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "opendialog WAVE AIFF",
          "outlettype": [
            "",
            "bang"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "path2",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            340,
            890,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend loadfile 1",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "repeats2",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            340,
            930,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend repeats 1",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "source2",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            340,
            990,
            225,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "buffer~ apgw_init2",
          "outlettype": [
            "float",
            "bang"
          ],
          "varname": "source2",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "loaded_defer2",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            340,
            1030,
            90,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "deferlow",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "loaded_msg2",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            340,
            1070,
            110,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "loaded 1",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "open3",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            656,
            850,
            225,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "opendialog WAVE AIFF",
          "outlettype": [
            "",
            "bang"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "path3",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            656,
            890,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend loadfile 2",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "repeats3",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            656,
            930,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend repeats 2",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "source3",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            656,
            990,
            225,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "buffer~ apgw_init3",
          "outlettype": [
            "float",
            "bang"
          ],
          "varname": "source3",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "loaded_defer3",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            656,
            1030,
            90,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "deferlow",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "loaded_msg3",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            656,
            1070,
            110,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "loaded 2",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "play_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            24,
            1130,
            112,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "play",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "new_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            145,
            1130,
            112,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "newpiece",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "demo_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            286,
            1130,
            112,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "demos",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "clear_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            407,
            1130,
            112,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "clearloop",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "pitch_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            24,
            1180,
            195,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend pitch",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "monitor_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            230,
            1180,
            195,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend monitor",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "loop_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            460,
            1180,
            195,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend loopmode",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "save_dialog",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            24,
            1230,
            195,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "savedialog WAVE",
          "outlettype": [
            "",
            "bang"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "save_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            245,
            1230,
            195,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend savepath",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "close",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            480,
            1230,
            108,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "closebang",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "shutdown_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            615,
            1230,
            110,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "shutdown",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "controller",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 4,
          "patching_rect": [
            24,
            1310,
            225,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "js cmpe_m4l.js 0",
          "outlettype": [
            "",
            "",
            "",
            ""
          ],
          "varname": "controller",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "output_buffer",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            300,
            1310,
            285,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "buffer~ apgw_out_init 1 2",
          "outlettype": [
            "float",
            "bang"
          ],
          "varname": "output_buffer",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "save_complete_defer",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            880,
            1310,
            100,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "deferlow",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "save_complete_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1005,
            1310,
            85,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "saved",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "wave_link",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            650,
            1310,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "t l",
          "outlettype": [
            "list"
          ],
          "varname": "wave_link",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "wave_change_l",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            300,
            1370,
            240,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend wavechange",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "wave_mouse_l",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            575,
            1370,
            240,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend wavemouse",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "wave_change_r",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            300,
            1410,
            240,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend wavechange",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "wave_mouse_r",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            575,
            1410,
            240,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend wavemouse",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "groove",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 3,
          "patching_rect": [
            24,
            1500,
            490,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "groove~ apgw_out_init 2 @loop 1 @loopinterp 1",
          "outlettype": [
            "signal",
            "signal",
            "signal"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "speed",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            24,
            1450,
            95,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "sig~ 0.",
          "outlettype": [
            "signal"
          ],
          "varname": "speed",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "run_gate",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            550,
            1500,
            110,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "line~ 0.",
          "outlettype": [
            "signal",
            "bang"
          ],
          "varname": "run_gate",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "clock",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            730,
            1500,
            175,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "count~ 0 0 0 0",
          "outlettype": [
            "signal"
          ],
          "varname": "clock",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "phase_snapshot",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            24,
            1560,
            145,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "snapshot~ 33",
          "outlettype": [
            "float"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "phase_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            24,
            1600,
            160,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend phase",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "total_frames",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            920,
            1500,
            205,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "sig~ 2147483647.",
          "outlettype": [
            "signal"
          ],
          "varname": "total_frames",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "loop_flag",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1185,
            1500,
            105,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "sig~ 0.",
          "outlettype": [
            "signal"
          ],
          "varname": "loop_flag",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "reached_end",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            730,
            1560,
            70,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": ">=~",
          "outlettype": [
            "signal"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "one_shot",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1185,
            1560,
            95,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "!-~ 1.",
          "outlettype": [
            "signal"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "done",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            920,
            1620,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "done_edge",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            920,
            1670,
            80,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "edge~",
          "outlettype": [
            "bang",
            "bang"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "play_token",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1025,
            1670,
            60,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "i 0",
          "outlettype": [
            "int"
          ],
          "varname": "play_token",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "done_defer",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1025,
            1710,
            100,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "deferlow",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "ended_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1025,
            1750,
            175,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend ended",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "not_done",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            730,
            1670,
            95,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "!-~ 1.",
          "outlettype": [
            "signal"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "edge_scale",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            370,
            1560,
            135,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "sig~ 200.",
          "outlettype": [
            "signal"
          ],
          "varname": "edge_scale",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "attack",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            210,
            1620,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "reverse_phase",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            370,
            1620,
            100,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "!-~ 1.",
          "outlettype": [
            "signal"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "release",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            370,
            1670,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "edge_min",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            210,
            1720,
            125,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "minimum~",
          "outlettype": [
            "signal"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "edge_envelope",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 1,
          "patching_rect": [
            210,
            1770,
            125,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "clip~ 0. 1.",
          "outlettype": [
            "signal"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "one_shot_gate",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            550,
            1770,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "amplitude_gate",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            550,
            1820,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "dsp_info",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 4,
          "patching_rect": [
            1025,
            1820,
            125,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "dspstate~",
          "outlettype": [
            "int",
            "float",
            "int",
            "int"
          ],
          "varname": "dsp_info",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "dsp_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            920,
            1870,
            195,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend dspstate",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "samplerate_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1140,
            1870,
            225,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend samplerate",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "monitor_gain",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            550,
            2070,
            205,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "line~ 0.25118864",
          "outlettype": [
            "signal",
            "bang"
          ],
          "varname": "monitor_gain",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "audio_driver",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 0,
          "patching_rect": [
            24,
            2190,
            120,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "plugout~",
          "varname": "audio_driver",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "stop_trigger",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            1460,
            1180,
            90,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "t b b b",
          "outlettype": [
            "bang",
            "bang",
            "bang"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "native_stop_fade",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1590,
            1230,
            85,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "0. 10",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "varname": "live_stop",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "stop_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1230,
            75,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "stop",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "gate_L",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            24,
            1900,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "listen_sum_L",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            24,
            1970,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "monitor_L",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            24,
            2070,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "gate_R",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            260,
            1900,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "listen_sum_R",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            260,
            1970,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "monitor_R",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            260,
            2070,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "backend_note",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            2270,
            1100,
            86
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "CMPE Max for Live 0.1.0 preview. MIDI -> instance-local controller. Finite buffer / live poly~ voices -> monitor -> MIDI velocity -> plugout~. Live owns hardware and audio engine. No adstatus, dac~ or startwindow. State is a stored-only pattr bound to the controller. Native host testing pending.",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "save_preset",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            736,
            16,
            96,
            30
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "SAVE SET",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "save_preset",
          "presentation": 0,
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "bgoncolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "textoncolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "textovercolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "parameter_enable": 0
        }
      },
      {
        "box": {
          "id": "load_preset",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            840,
            16,
            96,
            30
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "LOAD SET",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "load_preset",
          "presentation": 0,
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "bgoncolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "textoncolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "textovercolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "parameter_enable": 0
        }
      },
      {
        "box": {
          "id": "mode0",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            24,
            164,
            176,
            36
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "text": "APG",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "mode0",
          "presentation": 0,
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "bgoncolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "textoncolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "textovercolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose the APG instrument."
        }
      },
      {
        "box": {
          "id": "mode_msg0",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1390,
            130,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "mode 0",
          "outlettype": [
            ""
          ],
          "varname": "mode_msg0",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "mode1",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            208,
            164,
            176,
            36
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "ISJS",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "mode1",
          "presentation": 0,
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "bgoncolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "textoncolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "textovercolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose the ISJS instrument."
        }
      },
      {
        "box": {
          "id": "mode_msg1",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1605,
            1390,
            130,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "mode 1",
          "outlettype": [
            ""
          ],
          "varname": "mode_msg1",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "mode2",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            392,
            164,
            176,
            36
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "Many",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "mode2",
          "presentation": 0,
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "bgoncolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "textoncolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "textovercolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose the Many instrument."
        }
      },
      {
        "box": {
          "id": "mode_msg2",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1750,
            1390,
            130,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "mode 2",
          "outlettype": [
            ""
          ],
          "varname": "mode_msg2",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "mode3",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            576,
            164,
            176,
            36
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "RMHS",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "mode3",
          "presentation": 0,
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "bgoncolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "textoncolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "textovercolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose the RMHS instrument."
        }
      },
      {
        "box": {
          "id": "mode_msg3",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1895,
            1390,
            130,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "mode 3",
          "outlettype": [
            ""
          ],
          "varname": "mode_msg3",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "mode4",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            760,
            164,
            176,
            36
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "SIOE",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "mode4",
          "presentation": 0,
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "bgoncolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "textoncolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "textovercolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose the SIOE instrument."
        }
      },
      {
        "box": {
          "id": "mode_msg4",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            2040,
            1390,
            130,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "mode 4",
          "outlettype": [
            ""
          ],
          "varname": "mode_msg4",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "mode_info",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            208,
            912,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "APG / Audio Palindrome Generator",
          "varname": "mode_info",
          "presentation": 0,
          "hidden": 0,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "no_samples",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            256,
            912,
            48
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "RMHS creates its own sound. No samples are needed.",
          "varname": "no_samples",
          "presentation": 0,
          "hidden": 1,
          "linecount": 2,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "param_label0",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            324,
            138,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "Parameter 1",
          "varname": "param_label0",
          "presentation": 0,
          "hidden": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "param0",
          "maxclass": "flonum",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            24,
            350,
            138,
            30
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "param0",
          "presentation": 0,
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "hbgcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "triangle": 0,
          "format": 6,
          "parameter_enable": 0
        }
      },
      {
        "box": {
          "id": "param_msg0",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1450,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "prepend param 0",
          "varname": "param_msg0",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "param_label1",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            336,
            324,
            138,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "Parameter 2",
          "varname": "param_label1",
          "presentation": 0,
          "hidden": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "param1",
          "maxclass": "flonum",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            336,
            350,
            138,
            30
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "param1",
          "presentation": 0,
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "hbgcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "triangle": 0,
          "format": 6,
          "parameter_enable": 0
        }
      },
      {
        "box": {
          "id": "param_msg1",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1690,
            1450,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "prepend param 1",
          "varname": "param_msg1",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "param_label2",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            648,
            324,
            138,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "Parameter 3",
          "varname": "param_label2",
          "presentation": 0,
          "hidden": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "param2",
          "maxclass": "flonum",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            648,
            350,
            138,
            30
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "param2",
          "presentation": 0,
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "hbgcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "triangle": 0,
          "format": 6,
          "parameter_enable": 0
        }
      },
      {
        "box": {
          "id": "param_msg2",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1920,
            1450,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "prepend param 2",
          "varname": "param_msg2",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "param_label3",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            174,
            324,
            138,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "Parameter 4",
          "varname": "param_label3",
          "presentation": 0,
          "hidden": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "param3",
          "maxclass": "flonum",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            174,
            350,
            138,
            30
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "param3",
          "presentation": 0,
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "hbgcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "triangle": 0,
          "format": 6,
          "parameter_enable": 0
        }
      },
      {
        "box": {
          "id": "param_msg3",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1490,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "prepend param 3",
          "varname": "param_msg3",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "param_label4",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            486,
            324,
            138,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "Parameter 5",
          "varname": "param_label4",
          "presentation": 0,
          "hidden": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "param4",
          "maxclass": "flonum",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            486,
            350,
            138,
            30
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "param4",
          "presentation": 0,
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "hbgcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "triangle": 0,
          "format": 6,
          "parameter_enable": 0
        }
      },
      {
        "box": {
          "id": "param_msg4",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1690,
            1490,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "prepend param 4",
          "varname": "param_msg4",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "param_label5",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            798,
            324,
            138,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "Parameter 6",
          "varname": "param_label5",
          "presentation": 0,
          "hidden": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "param5",
          "maxclass": "flonum",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            798,
            350,
            138,
            30
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "param5",
          "presentation": 0,
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8980392156862745,
            0.9254901960784314,
            0.9411764705882353,
            1.0
          ],
          "hbgcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "triangle": 0,
          "format": 6,
          "parameter_enable": 0
        }
      },
      {
        "box": {
          "id": "param_msg5",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1920,
            1490,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "prepend param 5",
          "varname": "param_msg5",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "menu_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            798,
            324,
            138,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "Pitch set",
          "varname": "menu_label",
          "presentation": 0,
          "hidden": 1,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "mode_menu",
          "maxclass": "umenu",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            798,
            350,
            138,
            30
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "outlettype": [
            "int",
            "",
            ""
          ],
          "varname": "mode_menu",
          "presentation": 0,
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "items": [
            "Major",
            ",",
            "Minor",
            ",",
            "Pentatonic",
            ",",
            "Atonal",
            ",",
            "Microtonal"
          ],
          "parameter_enable": 0
        }
      },
      {
        "box": {
          "id": "choice_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1540,
            205,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "prepend choice",
          "varname": "choice_msg",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "scope_l",
          "maxclass": "scope~",
          "numinlets": 2,
          "numoutlets": 0,
          "patching_rect": [
            56,
            430,
            880,
            66
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "varname": "scope_l",
          "presentation": 0,
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "fgcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "gridcolor": [
            0.8745098039215686,
            0.9019607843137255,
            0.9215686274509803,
            1.0
          ],
          "calccount": 128,
          "bufsize": 256,
          "range": [
            -1.0,
            1.0
          ],
          "delay": 50,
          "trigger": 0
        }
      },
      {
        "box": {
          "id": "scope_r",
          "maxclass": "scope~",
          "numinlets": 2,
          "numoutlets": 0,
          "patching_rect": [
            56,
            504,
            880,
            66
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "varname": "scope_r",
          "presentation": 0,
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "fgcolor": [
            0.19215686274509805,
            0.37254901960784315,
            0.6509803921568628,
            1.0
          ],
          "gridcolor": [
            0.8745098039215686,
            0.9019607843137255,
            0.9215686274509803,
            1.0
          ],
          "calccount": 128,
          "bufsize": 256,
          "range": [
            -1.0,
            1.0
          ],
          "delay": 50,
          "trigger": 0
        }
      },
      {
        "box": {
          "id": "xy_pad",
          "maxclass": "jsui",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            56,
            430,
            600,
            140
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "outlettype": [
            ""
          ],
          "varname": "xy_pad",
          "presentation": 0,
          "hidden": 1,
          "filename": "cmpe_xy.js",
          "jsarguments": [],
          "border": 1,
          "parameter_enable": 0,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "scope_xy",
          "maxclass": "scope~",
          "numinlets": 2,
          "numoutlets": 0,
          "patching_rect": [
            672,
            430,
            264,
            140
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "varname": "scope_xy",
          "presentation": 0,
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "fgcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "gridcolor": [
            0.8745098039215686,
            0.9019607843137255,
            0.9215686274509803,
            1.0
          ],
          "calccount": 64,
          "bufsize": 256,
          "range": [
            -1.0,
            1.0
          ],
          "delay": 50,
          "trigger": 0
        }
      },
      {
        "box": {
          "id": "record_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            730,
            610,
            206,
            34
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.5450980392156862,
            0.2,
            0.2196078431372549,
            1.0
          ],
          "text": "RECORD WAV",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "record_button",
          "presentation": 0,
          "hidden": 1,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.9607843137254902,
            0.9019607843137255,
            0.8980392156862745,
            1.0
          ],
          "bgoncolor": [
            0.9333333333333333,
            0.8313725490196079,
            0.8313725490196079,
            1.0
          ],
          "textoncolor": [
            0.5450980392156862,
            0.2,
            0.2196078431372549,
            1.0
          ],
          "textovercolor": [
            0.5450980392156862,
            0.2,
            0.2196078431372549,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Record the current live instrument to a stereo WAV file."
        }
      },
      {
        "box": {
          "id": "recordtoggle_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1600,
            150,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "recordtoggle",
          "outlettype": [
            ""
          ],
          "varname": "recordtoggle_msg",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "record_dialog",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            1460,
            1660,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "savedialog WAVE",
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "record_dialog",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "record_dialog_path",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1700,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "prepend recordpath",
          "varname": "record_dialog_path",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "preset_save_dialog",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            1740,
            1660,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "savedialog JSON",
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "preset_save_dialog",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "preset_save_dialog_path",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1740,
            1700,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "prepend presetwrite",
          "varname": "preset_save_dialog_path",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "preset_load_dialog",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            2020,
            1660,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "opendialog JSON",
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "preset_load_dialog",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "preset_load_dialog_path",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            2020,
            1700,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "prepend presetread",
          "varname": "preset_load_dialog_path",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "save_preset_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1740,
            1600,
            180,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "presetsave",
          "outlettype": [
            ""
          ],
          "varname": "save_preset_msg",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "load_preset_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            2020,
            1600,
            180,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "presetload",
          "outlettype": [
            ""
          ],
          "varname": "load_preset_msg",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "grain_engine",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            1460,
            1790,
            300,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "poly~ cmpe_sample_voice 1",
          "outlettype": [
            "signal",
            "signal"
          ],
          "varname": "grain_engine",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "many_engine",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            1780,
            1790,
            300,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "poly~ cmpe_many_voice 1",
          "outlettype": [
            "signal",
            "signal"
          ],
          "varname": "many_engine",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "drone_engine",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            2100,
            1790,
            300,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "poly~ cmpe_drone_voice 1",
          "outlettype": [
            "signal",
            "signal"
          ],
          "varname": "drone_engine",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "live_gate",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            2440,
            1790,
            130,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "line~ 0.",
          "outlettype": [
            "signal",
            "bang"
          ],
          "varname": "live_gate",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "recorder",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            2440,
            2110,
            170,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "sfrecord~ 2",
          "outlettype": [
            "signal"
          ],
          "varname": "recorder",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "record_snapshot",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            2440,
            2160,
            180,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "snapshot~ 250",
          "outlettype": [
            "float"
          ],
          "varname": "record_snapshot",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "record_elapsed_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            2440,
            2200,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "prepend recordelapsed",
          "varname": "record_elapsed_msg",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "live_pair_L",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1870,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ],
          "varname": "live_pair_L",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "live_sum_L",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1920,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ],
          "varname": "live_sum_L",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "live_L",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1970,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ],
          "varname": "live_L",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "program_L",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            2040,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ],
          "varname": "program_L",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "live_pair_R",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1780,
            1870,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ],
          "varname": "live_pair_R",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "live_sum_R",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1780,
            1920,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ],
          "varname": "live_sum_R",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "live_R",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1780,
            1970,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ],
          "varname": "live_R",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "program_R",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1780,
            2040,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ],
          "varname": "program_R",
          "presentation": 0
        }
      },
      {
        "box": {
          "id": "m4l_rule0",
          "maxclass": "panel",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            140,
            8,
            1,
            130
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "varname": "m4l_rule0",
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "bgcolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "border": 0,
          "background": 1,
          "presentation": 1,
          "presentation_rect": [
            140,
            8,
            1,
            130
          ],
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "m4l_rule1",
          "maxclass": "panel",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            352,
            8,
            1,
            130
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "varname": "m4l_rule1",
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "bgcolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "border": 0,
          "background": 1,
          "presentation": 1,
          "presentation_rect": [
            352,
            8,
            1,
            130
          ],
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "m4l_rule2",
          "maxclass": "panel",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            616,
            8,
            1,
            130
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "varname": "m4l_rule2",
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "bgcolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "border": 0,
          "background": 1,
          "presentation": 1,
          "presentation_rect": [
            616,
            8,
            1,
            130
          ],
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "m4l_rule3",
          "maxclass": "panel",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            898,
            8,
            1,
            130
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "varname": "m4l_rule3",
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "bgcolor": [
            0.796078431372549,
            0.8352941176470589,
            0.8666666666666667,
            1.0
          ],
          "border": 0,
          "background": 1,
          "presentation": 1,
          "presentation_rect": [
            898,
            8,
            1,
            130
          ],
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "m4l_version",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            8,
            148,
            128,
            15
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "varname": "m4l_version",
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "v0.1.0 preview",
          "presentation": 1,
          "presentation_rect": [
            8,
            148,
            128,
            15
          ],
          "hidden": 0,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "linecount": 1
        }
      },
      {
        "box": {
          "id": "m4l_apg_note",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            446,
            82,
            164,
            42
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "varname": "m4l_apg_note",
          "textcolor": [
            0.3215686274509804,
            0.403921568627451,
            0.4588235294117647,
            1.0
          ],
          "text": "Symmetric edge trim\nkeeps the palindrome.",
          "presentation": 1,
          "presentation_rect": [
            446,
            82,
            164,
            42
          ],
          "hidden": 0,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "linecount": 3
        }
      },
      {
        "box": {
          "id": "m4l_latch",
          "maxclass": "toggle",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            906,
            82,
            17,
            17
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "varname": "m4l_latch",
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "outlettype": [
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            906,
            82,
            17,
            17
          ],
          "hidden": 0,
          "checkedcolor": [
            0.03137254901960784,
            0.4980392156862745,
            0.5137254901960784,
            1.0
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "parameter_enable": 1,
          "minimum": 0,
          "maximum": 1,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "MIDI Latch",
              "parameter_shortname": "Latch",
              "parameter_type": 1,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0
              ],
              "parameter_invisible": 0,
              "parameter_order": 1,
              "parameter_unitstyle": 0,
              "parameter_defer": 1,
              "parameter_mmin": 0,
              "parameter_mmax": 1
            }
          },
          "annotation": "Off: releasing the triggering MIDI note stops sound. On: ignore note-off; use STOP to end sound.",
          "hint": "Off: releasing the triggering MIDI note stops sound. On: ignore note-off; use STOP to end sound."
        }
      },
      {
        "box": {
          "id": "m4l_latch_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            930,
            81,
            160,
            20
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "varname": "m4l_latch_label",
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "Latch MIDI notes",
          "presentation": 1,
          "presentation_rect": [
            930,
            81,
            160,
            20
          ],
          "hidden": 0,
          "bgcolor": [
            0.9529411764705882,
            0.9647058823529412,
            0.9725490196078431,
            1.0
          ],
          "linecount": 1
        }
      },
      {
        "box": {
          "id": "m4l_latch_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1300,
            330,
            170,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "varname": "m4l_latch_msg",
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "prepend midilatch"
        }
      },
      {
        "box": {
          "id": "m4l_device",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            1300,
            400,
            180,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "varname": "m4l_device",
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "live.thisdevice",
          "outlettype": [
            "bang",
            "int",
            "int"
          ]
        }
      },
      {
        "box": {
          "id": "m4l_ready",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1300,
            440,
            120,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "varname": "m4l_ready",
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "hostready"
        }
      },
      {
        "box": {
          "id": "m4l_active",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1440,
            440,
            180,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "varname": "m4l_active",
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "prepend hostactive"
        }
      },
      {
        "box": {
          "id": "m4l_notein",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            1300,
            490,
            180,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "varname": "m4l_notein",
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "notein",
          "outlettype": [
            "int",
            "int",
            "int"
          ]
        }
      },
      {
        "box": {
          "id": "m4l_notepack",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 1,
          "patching_rect": [
            1300,
            530,
            180,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "varname": "m4l_notepack",
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "pack 0 0 0"
        }
      },
      {
        "box": {
          "id": "m4l_note",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1300,
            570,
            180,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "varname": "m4l_note",
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "prepend midinote"
        }
      },
      {
        "box": {
          "id": "cmpe_state",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            1300,
            630,
            420,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "varname": "cmpe_state",
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "pattr cmpe_state @bindto controller @parameter_enable 1",
          "outlettype": [
            "",
            "",
            ""
          ],
          "parameter_enable": 1,
          "saved_object_attributes": {
            "parameter_enable": 1
          },
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "CMPE Device State",
              "parameter_shortname": "State",
              "parameter_type": 3,
              "parameter_invisible": 1,
              "parameter_order": 0,
              "parameter_initial_enable": 0
            }
          }
        }
      },
      {
        "box": {
          "id": "m4l_velocity",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            1300,
            690,
            150,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "varname": "m4l_velocity",
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "line~ 1.",
          "outlettype": [
            "signal",
            "bang"
          ]
        }
      },
      {
        "box": {
          "id": "m4l_output_L",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1300,
            730,
            130,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "varname": "m4l_output_L",
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "m4l_output_R",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1480,
            730,
            130,
            22
          ],
          "fontname": "Arial",
          "fontsize": 11.0,
          "varname": "m4l_output_R",
          "textcolor": [
            0.10588235294117647,
            0.1607843137254902,
            0.21176470588235294,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      }
    ],
    "lines": [
      {
        "patchline": {
          "source": [
            "original_link",
            0
          ],
          "destination": [
            "original_url",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "load1",
            0
          ],
          "destination": [
            "open1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "open1",
            0
          ],
          "destination": [
            "path1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "path1",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "repeat1",
            0
          ],
          "destination": [
            "repeats1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "repeats1",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "source1",
            1
          ],
          "destination": [
            "loaded_defer1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "loaded_defer1",
            0
          ],
          "destination": [
            "loaded_msg1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "loaded_msg1",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "load2",
            0
          ],
          "destination": [
            "open2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "open2",
            0
          ],
          "destination": [
            "path2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "path2",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "repeat2",
            0
          ],
          "destination": [
            "repeats2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "repeats2",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "source2",
            1
          ],
          "destination": [
            "loaded_defer2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "loaded_defer2",
            0
          ],
          "destination": [
            "loaded_msg2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "loaded_msg2",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "load3",
            0
          ],
          "destination": [
            "open3",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "open3",
            0
          ],
          "destination": [
            "path3",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "path3",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "repeat3",
            0
          ],
          "destination": [
            "repeats3",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "repeats3",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "source3",
            1
          ],
          "destination": [
            "loaded_defer3",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "loaded_defer3",
            0
          ],
          "destination": [
            "loaded_msg3",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "loaded_msg3",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "play_button",
            0
          ],
          "destination": [
            "play_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "play_msg",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "new_button",
            0
          ],
          "destination": [
            "new_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "new_msg",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "demo_button",
            0
          ],
          "destination": [
            "demo_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "demo_msg",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "clear_button",
            0
          ],
          "destination": [
            "clear_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "clear_msg",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "pitch",
            0
          ],
          "destination": [
            "pitch_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "pitch_msg",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "monitor_level",
            0
          ],
          "destination": [
            "monitor_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "monitor_msg",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "loop_toggle",
            0
          ],
          "destination": [
            "loop_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "loop_msg",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "save_button",
            0
          ],
          "destination": [
            "save_dialog",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "save_dialog",
            0
          ],
          "destination": [
            "save_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "save_msg",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "close",
            0
          ],
          "destination": [
            "shutdown_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "shutdown_msg",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "output_buffer",
            1
          ],
          "destination": [
            "save_complete_defer",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "save_complete_defer",
            0
          ],
          "destination": [
            "save_complete_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "save_complete_msg",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "wave_link",
            0
          ],
          "destination": [
            "wave_l",
            4
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "wave_l",
            5
          ],
          "destination": [
            "wave_r",
            4
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "wave_l",
            5
          ],
          "destination": [
            "wave_change_l",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "wave_change_l",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "wave_l",
            4
          ],
          "destination": [
            "wave_mouse_l",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "wave_mouse_l",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "wave_r",
            5
          ],
          "destination": [
            "wave_l",
            4
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "wave_r",
            5
          ],
          "destination": [
            "wave_change_r",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "wave_change_r",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "wave_r",
            4
          ],
          "destination": [
            "wave_mouse_r",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "wave_mouse_r",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "controller",
            0
          ],
          "destination": [
            "groove",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "controller",
            1
          ],
          "destination": [
            "speed",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "controller",
            2
          ],
          "destination": [
            "run_gate",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "controller",
            3
          ],
          "destination": [
            "clock",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "speed",
            0
          ],
          "destination": [
            "groove",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "groove",
            2
          ],
          "destination": [
            "phase_snapshot",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "phase_snapshot",
            0
          ],
          "destination": [
            "phase_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "phase_msg",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "clock",
            0
          ],
          "destination": [
            "reached_end",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "total_frames",
            0
          ],
          "destination": [
            "reached_end",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "loop_flag",
            0
          ],
          "destination": [
            "one_shot",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "reached_end",
            0
          ],
          "destination": [
            "done",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "one_shot",
            0
          ],
          "destination": [
            "done",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "done",
            0
          ],
          "destination": [
            "done_edge",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "done",
            0
          ],
          "destination": [
            "not_done",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "done_edge",
            0
          ],
          "destination": [
            "play_token",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "play_token",
            0
          ],
          "destination": [
            "done_defer",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "done_defer",
            0
          ],
          "destination": [
            "ended_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "ended_msg",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "groove",
            2
          ],
          "destination": [
            "attack",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "groove",
            2
          ],
          "destination": [
            "reverse_phase",
            0
          ],
          "order": 2
        }
      },
      {
        "patchline": {
          "source": [
            "edge_scale",
            0
          ],
          "destination": [
            "attack",
            1
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "reverse_phase",
            0
          ],
          "destination": [
            "release",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "edge_scale",
            0
          ],
          "destination": [
            "release",
            1
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "attack",
            0
          ],
          "destination": [
            "edge_min",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "release",
            0
          ],
          "destination": [
            "edge_min",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "edge_min",
            0
          ],
          "destination": [
            "edge_envelope",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "edge_envelope",
            0
          ],
          "destination": [
            "one_shot_gate",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "not_done",
            0
          ],
          "destination": [
            "one_shot_gate",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "one_shot_gate",
            0
          ],
          "destination": [
            "amplitude_gate",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "run_gate",
            0
          ],
          "destination": [
            "amplitude_gate",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "dsp_info",
            0
          ],
          "destination": [
            "dsp_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "dsp_msg",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "dsp_info",
            1
          ],
          "destination": [
            "samplerate_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "samplerate_msg",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stop_button",
            0
          ],
          "destination": [
            "stop_trigger",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stop_trigger",
            1
          ],
          "destination": [
            "native_stop_fade",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "native_stop_fade",
            0
          ],
          "destination": [
            "run_gate",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "stop_trigger",
            0
          ],
          "destination": [
            "stop_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stop_msg",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "groove",
            0
          ],
          "destination": [
            "gate_L",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "amplitude_gate",
            0
          ],
          "destination": [
            "gate_L",
            1
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "listen_sum_L",
            0
          ],
          "destination": [
            "monitor_L",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "monitor_gain",
            0
          ],
          "destination": [
            "monitor_L",
            1
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "groove",
            1
          ],
          "destination": [
            "gate_R",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "amplitude_gate",
            0
          ],
          "destination": [
            "gate_R",
            1
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "listen_sum_R",
            0
          ],
          "destination": [
            "monitor_R",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "monitor_gain",
            0
          ],
          "destination": [
            "monitor_R",
            1
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "mode0",
            0
          ],
          "destination": [
            "mode_msg0",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mode_msg0",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mode1",
            0
          ],
          "destination": [
            "mode_msg1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mode_msg1",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mode2",
            0
          ],
          "destination": [
            "mode_msg2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mode_msg2",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mode3",
            0
          ],
          "destination": [
            "mode_msg3",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mode_msg3",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mode4",
            0
          ],
          "destination": [
            "mode_msg4",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mode_msg4",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "param0",
            0
          ],
          "destination": [
            "param_msg0",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "param_msg0",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "param1",
            0
          ],
          "destination": [
            "param_msg1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "param_msg1",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "param2",
            0
          ],
          "destination": [
            "param_msg2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "param_msg2",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "param3",
            0
          ],
          "destination": [
            "param_msg3",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "param_msg3",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "param4",
            0
          ],
          "destination": [
            "param_msg4",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "param_msg4",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "param5",
            0
          ],
          "destination": [
            "param_msg5",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "param_msg5",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mode_menu",
            0
          ],
          "destination": [
            "choice_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "choice_msg",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "xy_pad",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "record_button",
            0
          ],
          "destination": [
            "recordtoggle_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "recordtoggle_msg",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "record_dialog",
            0
          ],
          "destination": [
            "record_dialog_path",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "record_dialog_path",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "preset_save_dialog",
            0
          ],
          "destination": [
            "preset_save_dialog_path",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "preset_save_dialog_path",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "preset_load_dialog",
            0
          ],
          "destination": [
            "preset_load_dialog_path",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "preset_load_dialog_path",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "save_preset",
            0
          ],
          "destination": [
            "save_preset_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "save_preset_msg",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "load_preset",
            0
          ],
          "destination": [
            "load_preset_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "load_preset_msg",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "native_stop_fade",
            0
          ],
          "destination": [
            "live_gate",
            0
          ],
          "order": 2
        }
      },
      {
        "patchline": {
          "source": [
            "recorder",
            0
          ],
          "destination": [
            "record_snapshot",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "record_snapshot",
            0
          ],
          "destination": [
            "record_elapsed_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "record_elapsed_msg",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "grain_engine",
            0
          ],
          "destination": [
            "live_pair_L",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "many_engine",
            0
          ],
          "destination": [
            "live_pair_L",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "live_pair_L",
            0
          ],
          "destination": [
            "live_sum_L",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "drone_engine",
            0
          ],
          "destination": [
            "live_sum_L",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "live_sum_L",
            0
          ],
          "destination": [
            "live_L",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "live_gate",
            0
          ],
          "destination": [
            "live_L",
            1
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "live_L",
            0
          ],
          "destination": [
            "scope_l",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "live_L",
            0
          ],
          "destination": [
            "scope_xy",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "live_L",
            0
          ],
          "destination": [
            "recorder",
            0
          ],
          "order": 2
        }
      },
      {
        "patchline": {
          "source": [
            "gate_L",
            0
          ],
          "destination": [
            "program_L",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "live_L",
            0
          ],
          "destination": [
            "program_L",
            1
          ],
          "order": 3
        }
      },
      {
        "patchline": {
          "source": [
            "program_L",
            0
          ],
          "destination": [
            "listen_sum_L",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "grain_engine",
            1
          ],
          "destination": [
            "live_pair_R",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "many_engine",
            1
          ],
          "destination": [
            "live_pair_R",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "live_pair_R",
            0
          ],
          "destination": [
            "live_sum_R",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "drone_engine",
            1
          ],
          "destination": [
            "live_sum_R",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "live_sum_R",
            0
          ],
          "destination": [
            "live_R",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "live_gate",
            0
          ],
          "destination": [
            "live_R",
            1
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "live_R",
            0
          ],
          "destination": [
            "scope_r",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "live_R",
            0
          ],
          "destination": [
            "scope_xy",
            1
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "live_R",
            0
          ],
          "destination": [
            "recorder",
            1
          ],
          "order": 2
        }
      },
      {
        "patchline": {
          "source": [
            "gate_R",
            0
          ],
          "destination": [
            "program_R",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "live_R",
            0
          ],
          "destination": [
            "program_R",
            1
          ],
          "order": 3
        }
      },
      {
        "patchline": {
          "source": [
            "program_R",
            0
          ],
          "destination": [
            "listen_sum_R",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "m4l_latch",
            0
          ],
          "destination": [
            "m4l_latch_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "m4l_latch_msg",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "m4l_device",
            0
          ],
          "destination": [
            "m4l_ready",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "m4l_ready",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "m4l_device",
            1
          ],
          "destination": [
            "m4l_active",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "m4l_active",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "m4l_notein",
            0
          ],
          "destination": [
            "m4l_notepack",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "m4l_notein",
            1
          ],
          "destination": [
            "m4l_notepack",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "m4l_notein",
            2
          ],
          "destination": [
            "m4l_notepack",
            2
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "m4l_notepack",
            0
          ],
          "destination": [
            "m4l_note",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "m4l_note",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "monitor_L",
            0
          ],
          "destination": [
            "m4l_output_L",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "m4l_velocity",
            0
          ],
          "destination": [
            "m4l_output_L",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "m4l_output_L",
            0
          ],
          "destination": [
            "meter_L",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "m4l_output_L",
            0
          ],
          "destination": [
            "audio_driver",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "monitor_R",
            0
          ],
          "destination": [
            "m4l_output_R",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "m4l_velocity",
            0
          ],
          "destination": [
            "m4l_output_R",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "m4l_output_R",
            0
          ],
          "destination": [
            "meter_R",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "m4l_output_R",
            0
          ],
          "destination": [
            "audio_driver",
            1
          ],
          "order": 1
        }
      }
    ],
    "autosave": 0,
    "dependency_cache": [
      {
        "name": "cmpe_m4l.js",
        "type": "TEXT",
        "implicit": 1
      },
      {
        "name": "cmpe_xy.js",
        "type": "TEXT",
        "implicit": 1
      },
      {
        "name": "cmpe_sample_voice.maxpat",
        "type": "JSON",
        "implicit": 1
      },
      {
        "name": "cmpe_many_voice.maxpat",
        "type": "JSON",
        "implicit": 1
      },
      {
        "name": "cmpe_drone_voice.maxpat",
        "type": "JSON",
        "implicit": 1
      },
      {
        "name": "apgw_test1.wav",
        "type": "WAVE",
        "implicit": 1
      },
      {
        "name": "apgw_test2.wav",
        "type": "WAVE",
        "implicit": 1
      },
      {
        "name": "apgw_test3.wav",
        "type": "WAVE",
        "implicit": 1
      }
    ],
    "parameters": {
      "repeat1": [
        "Sample 1 Repeats",
        "Rep 1",
        0
      ],
      "repeat2": [
        "Sample 2 Repeats",
        "Rep 2",
        0
      ],
      "repeat3": [
        "Sample 3 Repeats",
        "Rep 3",
        0
      ],
      "pitch": [
        "Pitch Range",
        "Pitch",
        0
      ],
      "loop_toggle": [
        "Loop Selection",
        "Loop",
        0
      ],
      "m4l_latch": [
        "MIDI Latch",
        "Latch",
        0
      ],
      "monitor_level": [
        "Output Level",
        "Output",
        0
      ],
      "cmpe_state": [
        "CMPE Device State",
        "State",
        0
      ],
      "parameterbanks": {
        "0": {
          "index": 0,
          "name": "APG",
          "parameters": [
            "Sample 1 Repeats",
            "Sample 2 Repeats",
            "Sample 3 Repeats",
            "Pitch Range",
            "Loop Selection",
            "MIDI Latch",
            "Output Level",
            "-"
          ]
        }
      },
      "inherited_shortname": 1
    },
    "devicewidth": 1100.0,
    "openrect": [
      0.0,
      0.0,
      1100.0,
      169.0
    ],
    "openrectmode": 0,
    "latency": 0,
    "is_mpe": 0,
    "minimum_live_version": "",
    "minimum_max_version": "",
    "platform_compatibility": 0,
    "project": {
      "version": 1,
      "viewrect": [
        0.0,
        0.0,
        300.0,
        500.0
      ],
      "autoorganize": 1,
      "hideprojectwindow": 1,
      "showdependencies": 1,
      "autolocalize": 0,
      "contents": {
        "patchers": {}
      },
      "layout": {},
      "searchpath": {},
      "detailsvisible": 0,
      "readonly": 0,
      "devpathtype": 0,
      "devpath": ".",
      "sortmode": 0,
      "viewmode": 0,
      "includepackages": 0,
      "amxdtype": 1768515945
    }
  }
}
