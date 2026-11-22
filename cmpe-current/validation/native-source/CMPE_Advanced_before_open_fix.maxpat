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
      788
    ],
    "openinpresentation": 1,
    "default_fontsize": 17.0,
    "default_fontface": 0,
    "default_fontname": "Arial",
    "bgcolor": [
      0.9372549019607843,
      0.9450980392156862,
      0.9568627450980393,
      1.0
    ],
    "bglockedcolor": [
      0.9372549019607843,
      0.9450980392156862,
      0.9568627450980393,
      1.0
    ],
    "title": "CMPE Advanced / APG length, levels and variation",
    "boxes": [
      {
        "box": {
          "id": "title",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            20,
            10,
            580,
            36
          ],
          "fontname": "Arial",
          "fontsize": 24,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "CMPE / Advanced",
          "presentation": 1,
          "presentation_rect": [
            20,
            10,
            252,
            36
          ],
          "bgcolor": [
            0,
            0,
            0,
            0
          ],
          "fontface": 1,
          "varname": "title"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "Audio palindrome generator",
          "presentation": 0,
          "presentation_rect": [
            26,
            54,
            420,
            25
          ],
          "bgcolor": [
            0.9372549019607843,
            0.9450980392156862,
            0.9568627450980393,
            1.0
          ],
          "hidden": 1
        }
      },
      {
        "box": {
          "id": "demo_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            620,
            12,
            90,
            32
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "DEMO",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            620,
            12,
            90,
            32
          ],
          "varname": "demo_button",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "bgoncolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ],
          "textoncolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "textovercolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Load the three included demo sounds.",
          "usebgoncolor": 1,
          "usetextovercolor": 1,
          "fontface": 0
        }
      },
      {
        "box": {
          "id": "test_audio",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            718,
            12,
            126,
            32
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "TEST SOUND",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            718,
            12,
            126,
            32
          ],
          "varname": "test_audio",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "bgoncolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ],
          "textoncolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "textovercolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Play a short independent tone through the selected audio output.",
          "usebgoncolor": 1,
          "usetextovercolor": 1,
          "fontface": 0
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "presentation": 0,
          "presentation_rect": [
            24,
            85,
            792,
            1
          ],
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "presentation": 0,
          "presentation_rect": [
            24,
            280,
            792,
            1
          ],
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
            20,
            760,
            1060,
            1
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "presentation": 1,
          "presentation_rect": [
            20,
            760,
            1060,
            1
          ],
          "border": 0,
          "rounded": 0,
          "ignoreclick": 1,
          "varname": "credit_rule",
          "style": "CMPE_Solid_123_134_148_255"
        }
      },
      {
        "box": {
          "id": "source_label1",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            32,
            208,
            112,
            22
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "SAMPLE 1",
          "presentation": 1,
          "presentation_rect": [
            32,
            208,
            112,
            22
          ],
          "bgcolor": [
            0,
            0,
            0,
            0
          ],
          "fontface": 1,
          "varname": "source_label1",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "load1",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            260,
            206,
            92,
            30
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "text": "LOAD",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            260,
            206,
            92,
            30
          ],
          "varname": "load1",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.14901960784313725,
            0.19215686274509805,
            0.25098039215686274,
            1.0
          ],
          "bgoncolor": [
            0.06274509803921569,
            0.22745098039215686,
            0.6039215686274509,
            1.0
          ],
          "textoncolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "textovercolor": [
            0.7490196078431373,
            0.8588235294117647,
            0.996078431372549,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose a WAV/AIFF. Stops the current performance first; Cancel keeps the current sample.",
          "hidden": 0,
          "active": 1,
          "usebgoncolor": 1,
          "usetextovercolor": 1,
          "fontface": 1
        }
      },
      {
        "box": {
          "id": "file1",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            32,
            240,
            320,
            36
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "Loading demo sound...",
          "presentation": 1,
          "presentation_rect": [
            32,
            240,
            320,
            36
          ],
          "varname": "file1",
          "bgcolor": [
            0,
            0,
            0,
            0
          ],
          "linecount": 2,
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "repeat_label1",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            32,
            280,
            152,
            20
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "Sample 1 repeats",
          "presentation": 1,
          "presentation_rect": [
            32,
            280,
            152,
            20
          ],
          "bgcolor": [
            0,
            0,
            0,
            0
          ],
          "varname": "repeat_label1",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "repeat1",
          "maxclass": "number",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            32,
            302,
            152,
            28
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "presentation": 1,
          "presentation_rect": [
            32,
            302,
            152,
            28
          ],
          "varname": "repeat1",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "hbgcolor": [
            0.09019607843137255,
            0.30980392156862746,
            0.796078431372549,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "triangle": 0,
          "parameter_enable": 0,
          "minimum": 1,
          "maximum": 20,
          "hidden": 0,
          "bordercolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "source_label2",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            390,
            208,
            112,
            22
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "SAMPLE 2",
          "presentation": 1,
          "presentation_rect": [
            390,
            208,
            112,
            22
          ],
          "bgcolor": [
            0,
            0,
            0,
            0
          ],
          "fontface": 1,
          "varname": "source_label2",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "load2",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            618,
            206,
            92,
            30
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "text": "LOAD",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            618,
            206,
            92,
            30
          ],
          "varname": "load2",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.14901960784313725,
            0.19215686274509805,
            0.25098039215686274,
            1.0
          ],
          "bgoncolor": [
            0.06274509803921569,
            0.22745098039215686,
            0.6039215686274509,
            1.0
          ],
          "textoncolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "textovercolor": [
            0.7490196078431373,
            0.8588235294117647,
            0.996078431372549,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose a WAV/AIFF. Stops the current performance first; Cancel keeps the current sample.",
          "hidden": 0,
          "active": 1,
          "usebgoncolor": 1,
          "usetextovercolor": 1,
          "fontface": 1
        }
      },
      {
        "box": {
          "id": "file2",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            390,
            240,
            320,
            36
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "Loading demo sound...",
          "presentation": 1,
          "presentation_rect": [
            390,
            240,
            320,
            36
          ],
          "varname": "file2",
          "bgcolor": [
            0,
            0,
            0,
            0
          ],
          "linecount": 2,
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "repeat_label2",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            390,
            280,
            152,
            20
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "Sample 2 repeats",
          "presentation": 1,
          "presentation_rect": [
            390,
            280,
            152,
            20
          ],
          "bgcolor": [
            0,
            0,
            0,
            0
          ],
          "varname": "repeat_label2",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "repeat2",
          "maxclass": "number",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            390,
            302,
            152,
            28
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "presentation": 1,
          "presentation_rect": [
            390,
            302,
            152,
            28
          ],
          "varname": "repeat2",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "hbgcolor": [
            0.09019607843137255,
            0.30980392156862746,
            0.796078431372549,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "triangle": 0,
          "parameter_enable": 0,
          "minimum": 1,
          "maximum": 20,
          "hidden": 0,
          "bordercolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "source_label3",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            748,
            208,
            112,
            22
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "SAMPLE 3",
          "presentation": 1,
          "presentation_rect": [
            748,
            208,
            112,
            22
          ],
          "bgcolor": [
            0,
            0,
            0,
            0
          ],
          "fontface": 1,
          "varname": "source_label3",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "load3",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            976,
            206,
            92,
            30
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "text": "LOAD",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            976,
            206,
            92,
            30
          ],
          "varname": "load3",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.14901960784313725,
            0.19215686274509805,
            0.25098039215686274,
            1.0
          ],
          "bgoncolor": [
            0.06274509803921569,
            0.22745098039215686,
            0.6039215686274509,
            1.0
          ],
          "textoncolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "textovercolor": [
            0.7490196078431373,
            0.8588235294117647,
            0.996078431372549,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose a WAV/AIFF. Stops the current performance first; Cancel keeps the current sample.",
          "hidden": 0,
          "active": 1,
          "usebgoncolor": 1,
          "usetextovercolor": 1,
          "fontface": 1
        }
      },
      {
        "box": {
          "id": "file3",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            748,
            240,
            320,
            36
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "Loading demo sound...",
          "presentation": 1,
          "presentation_rect": [
            748,
            240,
            320,
            36
          ],
          "varname": "file3",
          "bgcolor": [
            0,
            0,
            0,
            0
          ],
          "linecount": 2,
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "repeat_label3",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            748,
            280,
            152,
            20
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "Sample 3 repeats",
          "presentation": 1,
          "presentation_rect": [
            748,
            280,
            152,
            20
          ],
          "bgcolor": [
            0,
            0,
            0,
            0
          ],
          "varname": "repeat_label3",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "repeat3",
          "maxclass": "number",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            748,
            302,
            152,
            28
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "presentation": 1,
          "presentation_rect": [
            748,
            302,
            152,
            28
          ],
          "varname": "repeat3",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "hbgcolor": [
            0.09019607843137255,
            0.30980392156862746,
            0.796078431372549,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "triangle": 0,
          "parameter_enable": 0,
          "minimum": 1,
          "maximum": 20,
          "hidden": 0,
          "bordercolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "pitch_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            200,
            280,
            152,
            20
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "Pitch range (all)",
          "presentation": 1,
          "presentation_rect": [
            200,
            280,
            152,
            20
          ],
          "bgcolor": [
            0,
            0,
            0,
            0
          ],
          "varname": "pitch_label",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "pitch",
          "maxclass": "flonum",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            200,
            302,
            152,
            28
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "presentation": 1,
          "presentation_rect": [
            200,
            302,
            152,
            28
          ],
          "varname": "pitch",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "hbgcolor": [
            0.09019607843137255,
            0.30980392156862746,
            0.796078431372549,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "triangle": 0,
          "parameter_enable": 0,
          "minimum": 0.0,
          "maximum": 1.0,
          "format": 6,
          "hidden": 0,
          "bordercolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "monitor_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            752,
            354,
            116,
            24
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "Volume (dB)",
          "presentation": 1,
          "presentation_rect": [
            752,
            354,
            116,
            24
          ],
          "bgcolor": [
            0,
            0,
            0,
            0
          ],
          "varname": "monitor_label"
        }
      },
      {
        "box": {
          "id": "monitor_level",
          "maxclass": "flonum",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            872,
            352,
            80,
            28
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "presentation": 1,
          "presentation_rect": [
            872,
            352,
            80,
            28
          ],
          "varname": "monitor_level",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "hbgcolor": [
            0.09019607843137255,
            0.30980392156862746,
            0.796078431372549,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "triangle": 0,
          "parameter_enable": 0,
          "minimum": -60.0,
          "maximum": 0.0,
          "format": 6,
          "bordercolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ]
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "LEVEL",
          "presentation": 0,
          "presentation_rect": [
            568,
            242,
            96,
            26
          ],
          "bgcolor": [
            0.9372549019607843,
            0.9450980392156862,
            0.9568627450980393,
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
            980,
            354,
            88,
            11
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "outlettype": [
            "float"
          ],
          "presentation": 1,
          "presentation_rect": [
            980,
            354,
            88,
            11
          ],
          "bgcolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "offcolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ],
          "oncolor": [
            0.09019607843137255,
            0.30980392156862746,
            0.796078431372549,
            1.0
          ],
          "monotone": 1,
          "orientation": 1,
          "varname": "meter_L"
        }
      },
      {
        "box": {
          "id": "meter_R",
          "maxclass": "meter~",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            980,
            369,
            88,
            11
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "outlettype": [
            "float"
          ],
          "presentation": 1,
          "presentation_rect": [
            980,
            369,
            88,
            11
          ],
          "bgcolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "offcolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ],
          "oncolor": [
            0.09019607843137255,
            0.30980392156862746,
            0.796078431372549,
            1.0
          ],
          "monotone": 1,
          "orientation": 1,
          "varname": "meter_R"
        }
      },
      {
        "box": {
          "id": "output_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            32,
            354,
            204,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "OUTPUT",
          "presentation": 1,
          "presentation_rect": [
            32,
            354,
            204,
            24
          ],
          "bgcolor": [
            0,
            0,
            0,
            0
          ],
          "fontface": 1,
          "varname": "output_label"
        }
      },
      {
        "box": {
          "id": "duration",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            244,
            354,
            210,
            24
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "Length: --",
          "presentation": 1,
          "presentation_rect": [
            244,
            354,
            210,
            24
          ],
          "varname": "duration",
          "bgcolor": [
            0,
            0,
            0,
            0
          ]
        }
      },
      {
        "box": {
          "id": "time",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            856,
            600,
            212,
            22
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "0.0 s",
          "presentation": 1,
          "presentation_rect": [
            856,
            600,
            212,
            22
          ],
          "varname": "time",
          "bgcolor": [
            0,
            0,
            0,
            0
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
            32,
            426,
            20,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "L",
          "presentation": 1,
          "presentation_rect": [
            32,
            426,
            20,
            24
          ],
          "bgcolor": [
            0,
            0,
            0,
            0
          ],
          "fontface": 1,
          "varname": "channel_l",
          "hidden": 0
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
            390,
            1012,
            96
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
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
          "presentation_rect": [
            56,
            390,
            1012,
            96
          ],
          "varname": "wave_l",
          "buffername": "apgw_out_init",
          "chanoffset": 1,
          "allowdrag": 0,
          "setmode": 1,
          "setunit": 0,
          "labels": 1,
          "quiet": 0,
          "outmode": 4,
          "bgcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "waveformcolor": [
            0.47058823529411764,
            0.7176470588235294,
            1.0,
            1.0
          ],
          "gridcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "selectioncolor": [
            1.0,
            1.0,
            1.0,
            0.18
          ],
          "vzoom": 1.0,
          "voffset": 0.0,
          "hint": "Drag across the waveform to choose a playback or loop range.",
          "hidden": 0,
          "bordercolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "linecolor": [
            1.0,
            1.0,
            1.0,
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
            32,
            532,
            20,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "R",
          "presentation": 1,
          "presentation_rect": [
            32,
            532,
            20,
            24
          ],
          "bgcolor": [
            0,
            0,
            0,
            0
          ],
          "fontface": 1,
          "varname": "channel_r",
          "hidden": 0
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
            496,
            1012,
            96
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
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
          "presentation_rect": [
            56,
            496,
            1012,
            96
          ],
          "varname": "wave_r",
          "buffername": "apgw_out_init",
          "chanoffset": 2,
          "allowdrag": 0,
          "setmode": 1,
          "setunit": 0,
          "labels": 1,
          "quiet": 0,
          "outmode": 4,
          "bgcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "waveformcolor": [
            0.8392156862745098,
            0.9019607843137255,
            0.9803921568627451,
            1.0
          ],
          "gridcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "selectioncolor": [
            1.0,
            1.0,
            1.0,
            0.18
          ],
          "vzoom": 1.0,
          "voffset": 0.0,
          "hint": "Drag across the waveform to choose a playback or loop range.",
          "hidden": 0,
          "bordercolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "linecolor": [
            1.0,
            1.0,
            1.0,
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
            32,
            600,
            580,
            22
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "Drag across the waveform to select a range.",
          "presentation": 1,
          "presentation_rect": [
            32,
            600,
            580,
            22
          ],
          "varname": "selection_info",
          "bgcolor": [
            0,
            0,
            0,
            0
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
            632,
            600,
            22,
            22
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "outlettype": [
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            632,
            600,
            22,
            22
          ],
          "varname": "loop_toggle",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "checkedcolor": [
            0.09019607843137255,
            0.30980392156862746,
            0.796078431372549,
            1.0
          ],
          "uncheckedcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Repeat the selected range. Turn off to play it once.",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "loop_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            664,
            598,
            180,
            28
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "Loop selected range",
          "presentation": 1,
          "presentation_rect": [
            664,
            598,
            180,
            28
          ],
          "bgcolor": [
            0,
            0,
            0,
            0
          ],
          "varname": "loop_label",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "clear_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            720,
            634,
            172,
            44
          ],
          "fontname": "Arial",
          "fontsize": 18.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "FULL RANGE",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            608,
            634,
            130,
            44
          ],
          "varname": "clear_button",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "bgoncolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ],
          "textoncolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "textovercolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Reset the selected range to the entire rendered piece.",
          "hidden": 0,
          "usebgoncolor": 1,
          "usetextovercolor": 1,
          "fontface": 0
        }
      },
      {
        "box": {
          "id": "save_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            904,
            634,
            176,
            44
          ],
          "fontname": "Arial",
          "fontsize": 16,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "SAVE DRY",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            750,
            634,
            144,
            44
          ],
          "varname": "save_button",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "bgoncolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ],
          "textoncolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "textovercolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Save the complete rendered piece as a WAV file.",
          "hidden": 0,
          "usebgoncolor": 1,
          "usetextovercolor": 1,
          "fontface": 0,
          "texton": "SAVE DRY"
        }
      },
      {
        "box": {
          "id": "play_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            20,
            634,
            328,
            44
          ],
          "fontname": "Arial",
          "fontsize": 22.0,
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
          "presentation_rect": [
            20,
            634,
            270,
            44
          ],
          "varname": "play_button",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.09019607843137255,
            0.30980392156862746,
            0.796078431372549,
            1.0
          ],
          "bgoncolor": [
            0.06274509803921569,
            0.22745098039215686,
            0.6039215686274509,
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
          "usebgoncolor": 1,
          "usetextovercolor": 1
        }
      },
      {
        "box": {
          "id": "stop_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            360,
            634,
            148,
            44
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.6588235294117647,
            0.12941176470588237,
            0.19607843137254902,
            1.0
          ],
          "text": "STOP",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            302,
            634,
            132,
            44
          ],
          "varname": "stop_button",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            1.0,
            0.9450980392156862,
            0.9490196078431372,
            1.0
          ],
          "bgoncolor": [
            0.9568627450980393,
            0.7764705882352941,
            0.8,
            1.0
          ],
          "textoncolor": [
            0.6588235294117647,
            0.12941176470588237,
            0.19607843137254902,
            1.0
          ],
          "textovercolor": [
            0.6588235294117647,
            0.12941176470588237,
            0.19607843137254902,
            1.0
          ],
          "parameter_enable": 0,
          "active": 1,
          "hint": "Stop audio or cancel preparation.",
          "usebgoncolor": 1,
          "usetextovercolor": 1,
          "fontface": 0
        }
      },
      {
        "box": {
          "id": "new_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            520,
            634,
            188,
            44
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "NEW",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            446,
            634,
            150,
            44
          ],
          "varname": "new_button",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "bgoncolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ],
          "textoncolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "textovercolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Start a fresh result for the selected instrument.",
          "usebgoncolor": 1,
          "usetextovercolor": 1,
          "fontface": 0
        }
      },
      {
        "box": {
          "id": "progress",
          "maxclass": "slider",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            32,
            740,
            228,
            10
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "outlettype": [
            ""
          ],
          "presentation": 1,
          "presentation_rect": [
            32,
            740,
            228,
            10
          ],
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
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "elementcolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "knobcolor": [
            0.09019607843137255,
            0.30980392156862746,
            0.796078431372549,
            1.0
          ],
          "knobshape": 0
        }
      },
      {
        "box": {
          "id": "render_info",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            276,
            688,
            792,
            22
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "Starting...",
          "presentation": 1,
          "presentation_rect": [
            276,
            688,
            792,
            22
          ],
          "varname": "render_info",
          "bgcolor": [
            0,
            0,
            0,
            0
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
            276,
            714,
            792,
            38
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "Loading the audio controller...",
          "presentation": 1,
          "presentation_rect": [
            276,
            714,
            792,
            38
          ],
          "varname": "status",
          "bgcolor": [
            0,
            0,
            0,
            0
          ],
          "linecount": 2
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
            766,
            680,
            20
          ],
          "fontname": "Arial",
          "fontsize": 12,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "Tape + Memory edition / CMPE by Joo Won Park / DSP from FX Patcher + Field Kit",
          "presentation": 1,
          "presentation_rect": [
            24,
            766,
            680,
            20
          ],
          "bgcolor": [
            0,
            0,
            0,
            0
          ],
          "varname": "original_credit"
        }
      },
      {
        "box": {
          "id": "original_link",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            812,
            764,
            268,
            22
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.09019607843137255,
            0.30980392156862746,
            0.796078431372549,
            1.0
          ],
          "text": "joowonpark.net/cmpe",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            812,
            764,
            268,
            22
          ],
          "varname": "original_link",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.9372549019607843,
            0.9450980392156862,
            0.9568627450980393,
            1.0
          ],
          "bgoncolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "textoncolor": [
            0.09019607843137255,
            0.30980392156862746,
            0.796078431372549,
            1.0
          ],
          "textovercolor": [
            0.09019607843137255,
            0.30980392156862746,
            0.796078431372549,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Open Joo Won Park's original Computer Music Practice Examples.",
          "usebgoncolor": 1,
          "usetextovercolor": 1,
          "fontface": 0
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
          "fontsize": 17.0,
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
          ]
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
          "fontsize": 17.0,
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
          "varname": "sample_dialog1"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend loadfile 0"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend repeats 0"
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
          "fontsize": 17.0,
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
          "varname": "source1"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "deferlow"
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
          "fontsize": 17.0,
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
          ]
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
          "fontsize": 17.0,
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
          "varname": "sample_dialog2"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend loadfile 1"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend repeats 1"
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
          "fontsize": 17.0,
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
          "varname": "source2"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "deferlow"
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
          "fontsize": 17.0,
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
          ]
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
          "fontsize": 17.0,
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
          "varname": "sample_dialog3"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend loadfile 2"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend repeats 2"
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
          "fontsize": 17.0,
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
          "varname": "source3"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "deferlow"
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
          "fontsize": 17.0,
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
          ]
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
          "fontsize": 17.0,
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
          ]
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
          "fontsize": 17.0,
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
          ]
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
          "fontsize": 17.0,
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
          ]
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
          "fontsize": 17.0,
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
          ]
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend pitch"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend monitor"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend loopmode"
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
          "fontsize": 17.0,
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
          ]
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend savepath"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "closebang"
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
          "fontsize": 17.0,
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
          ]
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "js cmpe_advanced_variety.js",
          "outlettype": [
            "",
            "",
            "",
            ""
          ],
          "varname": "controller"
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
          "fontsize": 17.0,
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
          "varname": "output_buffer"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "deferlow"
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
          "fontsize": 17.0,
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
          ]
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
          "fontsize": 17.0,
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
          "varname": "wave_link"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend wavechange"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend wavemouse"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend wavechange"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend wavemouse"
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
          "fontsize": 17.0,
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
          ]
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
          "fontsize": 17.0,
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
          "varname": "speed"
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
          "fontsize": 17.0,
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
          "varname": "run_gate"
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
          "fontsize": 17.0,
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
          "varname": "clock"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "snapshot~ 33",
          "outlettype": [
            "float"
          ]
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend phase"
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
          "fontsize": 17.0,
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
          "varname": "total_frames"
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
          "fontsize": 17.0,
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
          "varname": "loop_flag"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": ">=~",
          "outlettype": [
            "signal"
          ]
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "!-~ 1.",
          "outlettype": [
            "signal"
          ]
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
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
          "fontsize": 17.0,
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
          ]
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
          "fontsize": 17.0,
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
          "varname": "play_token"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "deferlow"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend ended"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "!-~ 1.",
          "outlettype": [
            "signal"
          ]
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
          "fontsize": 17.0,
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
          "varname": "edge_scale"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "!-~ 1.",
          "outlettype": [
            "signal"
          ]
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "minimum~",
          "outlettype": [
            "signal"
          ]
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "clip~ 0. 1.",
          "outlettype": [
            "signal"
          ]
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
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
          "fontsize": 17.0,
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
          "varname": "dsp_info"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend dspstate"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend samplerate"
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
          "fontsize": 17.0,
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
          "varname": "monitor_gain"
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "dac~ 1 2",
          "varname": "audio_driver"
        }
      },
      {
        "box": {
          "id": "test_trigger",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            1460,
            850,
            90,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
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
          ]
        }
      },
      {
        "box": {
          "id": "audio_on",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1590,
            850,
            135,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "startwindow",
          "outlettype": [
            ""
          ],
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
          "id": "test_status",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            900,
            430,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "set Test sound: listen for a short tone.",
          "outlettype": [
            ""
          ],
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
          "id": "test_delay",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            950,
            115,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "delay 200",
          "outlettype": [
            "bang"
          ]
        }
      },
      {
        "box": {
          "id": "test_envelope_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1000,
            350,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "0., 0.12 10 0.12 250 0. 20",
          "outlettype": [
            ""
          ],
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
          "id": "test_envelope",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            1460,
            1050,
            110,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
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
          ]
        }
      },
      {
        "box": {
          "id": "test_oscillator",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1630,
            1050,
            125,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "cycle~ 440",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "test_product",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1100,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
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
          "fontsize": 17.0,
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
          ]
        }
      },
      {
        "box": {
          "id": "test_stop_delay",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1740,
            1230,
            75,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
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
          "varname": "audio_test_stop"
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
          "fontsize": 17.0,
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
          "varname": "live_stop"
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
          "fontsize": 17.0,
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
          ]
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ]
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ]
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
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
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "CMPE program L/R -> Tape -> Drifting Memory -> linked stereo peak ceiling -> processed recorder + monitor. Test tone joins only the monitor. SAVE DRY exports the original rendered buffer.",
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
          "id": "save_preset",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            852,
            12,
            110,
            32
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "SAVE SET",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "save_preset",
          "presentation": 1,
          "presentation_rect": [
            852,
            12,
            110,
            32
          ],
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "bgoncolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ],
          "textoncolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "textovercolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "parameter_enable": 0,
          "usebgoncolor": 1,
          "usetextovercolor": 1,
          "fontface": 0
        }
      },
      {
        "box": {
          "id": "load_preset",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            970,
            12,
            110,
            32
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "LOAD SET",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "load_preset",
          "presentation": 1,
          "presentation_rect": [
            970,
            12,
            110,
            32
          ],
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "bgoncolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ],
          "textoncolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "textovercolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "parameter_enable": 0,
          "usebgoncolor": 1,
          "usetextovercolor": 1,
          "fontface": 0
        }
      },
      {
        "box": {
          "id": "audio_status",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            736,
            54,
            332,
            20
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "Reading Max audio settings...",
          "varname": "audio_status",
          "presentation": 1,
          "presentation_rect": [
            736,
            54,
            332,
            20
          ],
          "hidden": 0,
          "bgcolor": [
            0,
            0,
            0,
            0
          ]
        }
      },
      {
        "box": {
          "id": "audio_setup",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            736,
            78,
            124,
            28
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "text": "AUDIO SETUP",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "audio_setup",
          "presentation": 1,
          "presentation_rect": [
            736,
            78,
            124,
            28
          ],
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.14901960784313725,
            0.19215686274509805,
            0.25098039215686274,
            1.0
          ],
          "bgoncolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "textoncolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "textovercolor": [
            0.7490196078431373,
            0.8588235294117647,
            0.996078431372549,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Open Max's native Audio Status or Audio Settings window.",
          "usebgoncolor": 1,
          "usetextovercolor": 1,
          "fontface": 0
        }
      },
      {
        "box": {
          "id": "audio_refresh",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            868,
            78,
            92,
            28
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "text": "REFRESH",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "audio_refresh",
          "presentation": 1,
          "presentation_rect": [
            868,
            78,
            92,
            28
          ],
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.14901960784313725,
            0.19215686274509805,
            0.25098039215686274,
            1.0
          ],
          "bgoncolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "textoncolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "textovercolor": [
            0.7490196078431373,
            0.8588235294117647,
            0.996078431372549,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Read the current audio driver and available devices from Max.",
          "usebgoncolor": 1,
          "usetextovercolor": 1,
          "fontface": 0
        }
      },
      {
        "box": {
          "id": "audio_power",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            968,
            78,
            100,
            28
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "text": "AUDIO OFF",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "audio_power",
          "presentation": 1,
          "presentation_rect": [
            968,
            78,
            100,
            28
          ],
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.14901960784313725,
            0.19215686274509805,
            0.25098039215686274,
            1.0
          ],
          "bgoncolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "textoncolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "textovercolor": [
            0.7490196078431373,
            0.8588235294117647,
            0.996078431372549,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Turn Max audio on or off. This setting affects all Max patches.",
          "usebgoncolor": 1,
          "usetextovercolor": 1,
          "fontface": 0
        }
      },
      {
        "box": {
          "id": "audio_panel",
          "maxclass": "panel",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            20,
            52,
            1060,
            64
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "varname": "audio_panel",
          "presentation": 1,
          "presentation_rect": [
            20,
            52,
            1060,
            64
          ],
          "hidden": 0,
          "border": 0,
          "rounded": 6,
          "background": 1,
          "ignoreclick": 1,
          "style": "CMPE_Solid_224_229_235_255"
        }
      },
      {
        "box": {
          "id": "audio_driver_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            32,
            54,
            182,
            20
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "Audio driver",
          "varname": "audio_driver_label",
          "presentation": 1,
          "presentation_rect": [
            32,
            54,
            182,
            20
          ],
          "hidden": 0,
          "bgcolor": [
            0,
            0,
            0,
            0
          ]
        }
      },
      {
        "box": {
          "id": "audio_driver_menu",
          "maxclass": "umenu",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            32,
            78,
            182,
            28
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "outlettype": [
            "int",
            "",
            ""
          ],
          "varname": "audio_driver_menu",
          "presentation": 1,
          "presentation_rect": [
            32,
            78,
            182,
            28
          ],
          "hidden": 0,
          "items": [
            "Waiting for Max..."
          ],
          "parameter_enable": 0,
          "style": "CMPE_Solid_255_255_255_255",
          "applycolors": 1
        }
      },
      {
        "box": {
          "id": "audio_option1_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            226,
            54,
            242,
            20
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "Driver option 1",
          "varname": "audio_option1_label",
          "presentation": 1,
          "presentation_rect": [
            226,
            54,
            242,
            20
          ],
          "hidden": 0,
          "bgcolor": [
            0,
            0,
            0,
            0
          ]
        }
      },
      {
        "box": {
          "id": "audio_option1_menu",
          "maxclass": "umenu",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            226,
            78,
            242,
            28
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "outlettype": [
            "int",
            "",
            ""
          ],
          "varname": "audio_option1_menu",
          "presentation": 1,
          "presentation_rect": [
            226,
            78,
            242,
            28
          ],
          "hidden": 0,
          "items": [
            "Waiting for Max..."
          ],
          "parameter_enable": 0,
          "style": "CMPE_Solid_255_255_255_255",
          "applycolors": 1
        }
      },
      {
        "box": {
          "id": "audio_option2_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            480,
            54,
            242,
            20
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "Driver option 2",
          "varname": "audio_option2_label",
          "presentation": 1,
          "presentation_rect": [
            480,
            54,
            242,
            20
          ],
          "hidden": 0,
          "bgcolor": [
            0,
            0,
            0,
            0
          ]
        }
      },
      {
        "box": {
          "id": "audio_option2_menu",
          "maxclass": "umenu",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            480,
            78,
            242,
            28
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "outlettype": [
            "int",
            "",
            ""
          ],
          "varname": "audio_option2_menu",
          "presentation": 1,
          "presentation_rect": [
            480,
            78,
            242,
            28
          ],
          "hidden": 0,
          "items": [
            "Waiting for Max..."
          ],
          "parameter_enable": 0,
          "style": "CMPE_Solid_255_255_255_255",
          "applycolors": 1
        }
      },
      {
        "box": {
          "id": "mode0",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            20,
            124,
            200,
            36
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
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
          "presentation": 1,
          "presentation_rect": [
            20,
            124,
            200,
            36
          ],
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.09019607843137255,
            0.30980392156862746,
            0.796078431372549,
            1.0
          ],
          "bgoncolor": [
            0.09019607843137255,
            0.30980392156862746,
            0.796078431372549,
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
          "hint": "Choose the APG instrument.",
          "usebgoncolor": 1,
          "usetextovercolor": 1,
          "fontface": 0
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
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
          ]
        }
      },
      {
        "box": {
          "id": "mode1",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            235,
            124,
            200,
            36
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "ISJS",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "mode1",
          "presentation": 1,
          "presentation_rect": [
            235,
            124,
            200,
            36
          ],
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "bgoncolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ],
          "textoncolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "textovercolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose the ISJS instrument.",
          "usebgoncolor": 1,
          "usetextovercolor": 1,
          "fontface": 0
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
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
          ]
        }
      },
      {
        "box": {
          "id": "mode2",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            450,
            124,
            200,
            36
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "Many",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "mode2",
          "presentation": 1,
          "presentation_rect": [
            450,
            124,
            200,
            36
          ],
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "bgoncolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ],
          "textoncolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "textovercolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose the Many instrument.",
          "usebgoncolor": 1,
          "usetextovercolor": 1,
          "fontface": 0
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
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
          ]
        }
      },
      {
        "box": {
          "id": "mode3",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            665,
            124,
            200,
            36
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "RMHS",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "mode3",
          "presentation": 1,
          "presentation_rect": [
            665,
            124,
            200,
            36
          ],
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "bgoncolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ],
          "textoncolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "textovercolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose the RMHS instrument.",
          "usebgoncolor": 1,
          "usetextovercolor": 1,
          "fontface": 0
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
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
          ]
        }
      },
      {
        "box": {
          "id": "mode4",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            880,
            124,
            200,
            36
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "SIOE",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "mode4",
          "presentation": 1,
          "presentation_rect": [
            880,
            124,
            200,
            36
          ],
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "bgoncolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ],
          "textoncolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "textovercolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose the SIOE instrument.",
          "usebgoncolor": 1,
          "usetextovercolor": 1,
          "fontface": 0
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
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
          ]
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
            168,
            1052,
            22
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "APG / Audio Palindrome Generator",
          "varname": "mode_info",
          "presentation": 1,
          "presentation_rect": [
            24,
            168,
            1052,
            22
          ],
          "hidden": 0,
          "bgcolor": [
            0,
            0,
            0,
            0
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
            32,
            254,
            1036,
            40
          ],
          "fontname": "Arial",
          "fontsize": 18.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "RMHS creates its own sound. No samples are needed.",
          "varname": "no_samples",
          "presentation": 0,
          "presentation_rect": [
            32,
            254,
            1036,
            40
          ],
          "hidden": 1,
          "linecount": 2,
          "bgcolor": [
            0.9372549019607843,
            0.9450980392156862,
            0.9568627450980393,
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
            32,
            280,
            152,
            20
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "Parameter 1",
          "varname": "param_label0",
          "presentation": 1,
          "presentation_rect": [
            32,
            280,
            152,
            20
          ],
          "hidden": 1,
          "bgcolor": [
            0,
            0,
            0,
            0
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
            32,
            302,
            152,
            28
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "param0",
          "presentation": 1,
          "presentation_rect": [
            32,
            302,
            152,
            28
          ],
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "hbgcolor": [
            0.09019607843137255,
            0.30980392156862746,
            0.796078431372549,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "triangle": 0,
          "format": 6,
          "parameter_enable": 0,
          "bordercolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ]
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "prepend param 0",
          "varname": "param_msg0"
        }
      },
      {
        "box": {
          "id": "param_label1",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            390,
            280,
            152,
            20
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "Parameter 2",
          "varname": "param_label1",
          "presentation": 1,
          "presentation_rect": [
            390,
            280,
            152,
            20
          ],
          "hidden": 1,
          "bgcolor": [
            0,
            0,
            0,
            0
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
            390,
            302,
            152,
            28
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "param1",
          "presentation": 1,
          "presentation_rect": [
            390,
            302,
            152,
            28
          ],
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "hbgcolor": [
            0.09019607843137255,
            0.30980392156862746,
            0.796078431372549,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "triangle": 0,
          "format": 6,
          "parameter_enable": 0,
          "bordercolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ]
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "prepend param 1",
          "varname": "param_msg1"
        }
      },
      {
        "box": {
          "id": "param_label2",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            748,
            280,
            152,
            20
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "Parameter 3",
          "varname": "param_label2",
          "presentation": 1,
          "presentation_rect": [
            748,
            280,
            152,
            20
          ],
          "hidden": 1,
          "bgcolor": [
            0,
            0,
            0,
            0
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
            748,
            302,
            152,
            28
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "param2",
          "presentation": 1,
          "presentation_rect": [
            748,
            302,
            152,
            28
          ],
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "hbgcolor": [
            0.09019607843137255,
            0.30980392156862746,
            0.796078431372549,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "triangle": 0,
          "format": 6,
          "parameter_enable": 0,
          "bordercolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ]
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "prepend param 2",
          "varname": "param_msg2"
        }
      },
      {
        "box": {
          "id": "param_label3",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            200,
            280,
            152,
            20
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "Parameter 4",
          "varname": "param_label3",
          "presentation": 1,
          "presentation_rect": [
            200,
            280,
            152,
            20
          ],
          "hidden": 1,
          "bgcolor": [
            0,
            0,
            0,
            0
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
            200,
            302,
            152,
            28
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "param3",
          "presentation": 1,
          "presentation_rect": [
            200,
            302,
            152,
            28
          ],
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "hbgcolor": [
            0.09019607843137255,
            0.30980392156862746,
            0.796078431372549,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "triangle": 0,
          "format": 6,
          "parameter_enable": 0,
          "bordercolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ]
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "prepend param 3",
          "varname": "param_msg3"
        }
      },
      {
        "box": {
          "id": "param_label4",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            558,
            280,
            152,
            20
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "Parameter 5",
          "varname": "param_label4",
          "presentation": 1,
          "presentation_rect": [
            558,
            280,
            152,
            20
          ],
          "hidden": 1,
          "bgcolor": [
            0,
            0,
            0,
            0
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
            558,
            302,
            152,
            28
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "param4",
          "presentation": 1,
          "presentation_rect": [
            558,
            302,
            152,
            28
          ],
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "hbgcolor": [
            0.09019607843137255,
            0.30980392156862746,
            0.796078431372549,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "triangle": 0,
          "format": 6,
          "parameter_enable": 0,
          "bordercolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ]
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "prepend param 4",
          "varname": "param_msg4"
        }
      },
      {
        "box": {
          "id": "param_label5",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            916,
            280,
            152,
            20
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "Parameter 6",
          "varname": "param_label5",
          "presentation": 1,
          "presentation_rect": [
            916,
            280,
            152,
            20
          ],
          "hidden": 1,
          "bgcolor": [
            0,
            0,
            0,
            0
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
            916,
            302,
            152,
            28
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "param5",
          "presentation": 1,
          "presentation_rect": [
            916,
            302,
            152,
            28
          ],
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "bgoncolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "hbgcolor": [
            0.09019607843137255,
            0.30980392156862746,
            0.796078431372549,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "triangle": 0,
          "format": 6,
          "parameter_enable": 0,
          "bordercolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ]
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "prepend param 5",
          "varname": "param_msg5"
        }
      },
      {
        "box": {
          "id": "menu_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            916,
            280,
            152,
            20
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "Pitch set",
          "varname": "menu_label",
          "presentation": 1,
          "presentation_rect": [
            916,
            280,
            152,
            20
          ],
          "hidden": 1,
          "bgcolor": [
            0,
            0,
            0,
            0
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
            916,
            302,
            152,
            28
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "outlettype": [
            "int",
            "",
            ""
          ],
          "varname": "mode_menu",
          "presentation": 1,
          "presentation_rect": [
            916,
            302,
            152,
            28
          ],
          "hidden": 1,
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
          "parameter_enable": 0,
          "style": "CMPE_Solid_255_255_255_255",
          "applycolors": 1
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "prepend choice",
          "varname": "choice_msg"
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
            390,
            1012,
            96
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "varname": "scope_l",
          "presentation": 1,
          "presentation_rect": [
            56,
            390,
            1012,
            96
          ],
          "hidden": 1,
          "bgcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "fgcolor": [
            0.47058823529411764,
            0.7176470588235294,
            1.0,
            1.0
          ],
          "gridcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
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
            496,
            1012,
            96
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "varname": "scope_r",
          "presentation": 1,
          "presentation_rect": [
            56,
            496,
            1012,
            96
          ],
          "hidden": 1,
          "bgcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "fgcolor": [
            0.8392156862745098,
            0.9019607843137255,
            0.9803921568627451,
            1.0
          ],
          "gridcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
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
            390,
            684,
            202
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "outlettype": [
            ""
          ],
          "varname": "xy_pad",
          "presentation": 1,
          "presentation_rect": [
            56,
            390,
            684,
            202
          ],
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
            756,
            390,
            312,
            202
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "varname": "scope_xy",
          "presentation": 1,
          "presentation_rect": [
            756,
            390,
            312,
            202
          ],
          "hidden": 1,
          "bgcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "fgcolor": [
            0.47058823529411764,
            0.7176470588235294,
            1.0,
            1.0
          ],
          "gridcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
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
            720,
            634,
            360,
            44
          ],
          "fontname": "Arial",
          "fontsize": 16,
          "textcolor": [
            0.6588235294117647,
            0.12941176470588237,
            0.19607843137254902,
            1.0
          ],
          "text": "RECORD FX",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "record_button",
          "presentation": 1,
          "presentation_rect": [
            906,
            634,
            174,
            44
          ],
          "hidden": 1,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            1.0,
            0.9450980392156862,
            0.9490196078431372,
            1.0
          ],
          "bgoncolor": [
            0.9568627450980393,
            0.7764705882352941,
            0.8,
            1.0
          ],
          "textoncolor": [
            0.6588235294117647,
            0.12941176470588237,
            0.19607843137254902,
            1.0
          ],
          "textovercolor": [
            0.6588235294117647,
            0.12941176470588237,
            0.19607843137254902,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Record all five modes through Tape and Drifting Memory. Monitoring volume does not affect capture.",
          "usebgoncolor": 1,
          "usetextovercolor": 1,
          "fontface": 0,
          "texton": "RECORD FX"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
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
          ]
        }
      },
      {
        "box": {
          "id": "source_card1",
          "maxclass": "panel",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            20,
            198,
            344,
            138
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "varname": "source_card1",
          "presentation": 1,
          "presentation_rect": [
            20,
            198,
            344,
            138
          ],
          "hidden": 0,
          "border": 1,
          "bordercolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ],
          "rounded": 10,
          "background": 1,
          "ignoreclick": 1,
          "style": "CMPE_Solid_255_255_255_255"
        }
      },
      {
        "box": {
          "id": "source_accent1",
          "maxclass": "panel",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            21,
            199,
            342,
            4
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "varname": "source_accent1",
          "presentation": 1,
          "presentation_rect": [
            21,
            199,
            342,
            4
          ],
          "hidden": 0,
          "border": 0,
          "rounded": 0,
          "background": 1,
          "ignoreclick": 1,
          "style": "CMPE_Solid_38_49_64_255"
        }
      },
      {
        "box": {
          "id": "source_state1",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            150,
            210,
            100,
            20
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "EMPTY",
          "varname": "source_state1",
          "presentation": 1,
          "presentation_rect": [
            150,
            210,
            100,
            20
          ],
          "hidden": 0,
          "bgcolor": [
            0,
            0,
            0,
            0
          ]
        }
      },
      {
        "box": {
          "id": "group_label1",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            32,
            208,
            320,
            22
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "",
          "varname": "group_label1",
          "presentation": 1,
          "presentation_rect": [
            32,
            208,
            320,
            22
          ],
          "hidden": 1,
          "fontface": 1,
          "bgcolor": [
            0,
            0,
            0,
            0
          ]
        }
      },
      {
        "box": {
          "id": "group_help1",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            32,
            240,
            320,
            36
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "",
          "varname": "group_help1",
          "presentation": 1,
          "presentation_rect": [
            32,
            240,
            320,
            36
          ],
          "hidden": 1,
          "bgcolor": [
            0,
            0,
            0,
            0
          ]
        }
      },
      {
        "box": {
          "id": "source_card2",
          "maxclass": "panel",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            378,
            198,
            344,
            138
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "varname": "source_card2",
          "presentation": 1,
          "presentation_rect": [
            378,
            198,
            344,
            138
          ],
          "hidden": 0,
          "border": 1,
          "bordercolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ],
          "rounded": 10,
          "background": 1,
          "ignoreclick": 1,
          "style": "CMPE_Solid_255_255_255_255"
        }
      },
      {
        "box": {
          "id": "source_accent2",
          "maxclass": "panel",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            379,
            199,
            342,
            4
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "varname": "source_accent2",
          "presentation": 1,
          "presentation_rect": [
            379,
            199,
            342,
            4
          ],
          "hidden": 0,
          "border": 0,
          "rounded": 0,
          "background": 1,
          "ignoreclick": 1,
          "style": "CMPE_Solid_38_49_64_255"
        }
      },
      {
        "box": {
          "id": "source_state2",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            508,
            210,
            100,
            20
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "EMPTY",
          "varname": "source_state2",
          "presentation": 1,
          "presentation_rect": [
            508,
            210,
            100,
            20
          ],
          "hidden": 0,
          "bgcolor": [
            0,
            0,
            0,
            0
          ]
        }
      },
      {
        "box": {
          "id": "group_label2",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            390,
            208,
            320,
            22
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "",
          "varname": "group_label2",
          "presentation": 1,
          "presentation_rect": [
            390,
            208,
            320,
            22
          ],
          "hidden": 1,
          "fontface": 1,
          "bgcolor": [
            0,
            0,
            0,
            0
          ]
        }
      },
      {
        "box": {
          "id": "group_help2",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            390,
            240,
            320,
            36
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "",
          "varname": "group_help2",
          "presentation": 1,
          "presentation_rect": [
            390,
            240,
            320,
            36
          ],
          "hidden": 1,
          "bgcolor": [
            0,
            0,
            0,
            0
          ]
        }
      },
      {
        "box": {
          "id": "source_card3",
          "maxclass": "panel",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            736,
            198,
            344,
            138
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "varname": "source_card3",
          "presentation": 1,
          "presentation_rect": [
            736,
            198,
            344,
            138
          ],
          "hidden": 0,
          "border": 1,
          "bordercolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ],
          "rounded": 10,
          "background": 1,
          "ignoreclick": 1,
          "style": "CMPE_Solid_255_255_255_255"
        }
      },
      {
        "box": {
          "id": "source_accent3",
          "maxclass": "panel",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            737,
            199,
            342,
            4
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "varname": "source_accent3",
          "presentation": 1,
          "presentation_rect": [
            737,
            199,
            342,
            4
          ],
          "hidden": 0,
          "border": 0,
          "rounded": 0,
          "background": 1,
          "ignoreclick": 1,
          "style": "CMPE_Solid_38_49_64_255"
        }
      },
      {
        "box": {
          "id": "source_state3",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            866,
            210,
            100,
            20
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "EMPTY",
          "varname": "source_state3",
          "presentation": 1,
          "presentation_rect": [
            866,
            210,
            100,
            20
          ],
          "hidden": 0,
          "bgcolor": [
            0,
            0,
            0,
            0
          ]
        }
      },
      {
        "box": {
          "id": "group_label3",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            748,
            208,
            320,
            22
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "",
          "varname": "group_label3",
          "presentation": 1,
          "presentation_rect": [
            748,
            208,
            320,
            22
          ],
          "hidden": 1,
          "fontface": 1,
          "bgcolor": [
            0,
            0,
            0,
            0
          ]
        }
      },
      {
        "box": {
          "id": "group_help3",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            748,
            240,
            320,
            36
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "",
          "varname": "group_help3",
          "presentation": 1,
          "presentation_rect": [
            748,
            240,
            320,
            36
          ],
          "hidden": 1,
          "bgcolor": [
            0,
            0,
            0,
            0
          ]
        }
      },
      {
        "box": {
          "id": "output_panel",
          "maxclass": "panel",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            20,
            344,
            1060,
            282
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "varname": "output_panel",
          "presentation": 1,
          "presentation_rect": [
            20,
            344,
            1060,
            282
          ],
          "hidden": 0,
          "border": 1,
          "bordercolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ],
          "rounded": 10,
          "background": 1,
          "ignoreclick": 1,
          "style": "CMPE_Solid_255_255_255_255"
        }
      },
      {
        "box": {
          "id": "feedback_panel",
          "maxclass": "panel",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            20,
            684,
            1060,
            72
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "varname": "feedback_panel",
          "presentation": 1,
          "presentation_rect": [
            20,
            684,
            1060,
            72
          ],
          "hidden": 0,
          "border": 1,
          "bordercolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ],
          "rounded": 10,
          "background": 1,
          "ignoreclick": 1,
          "style": "CMPE_Solid_255_255_255_255"
        }
      },
      {
        "box": {
          "id": "state_badge",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            32,
            698,
            228,
            28
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "LOADING",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "state_badge",
          "presentation": 1,
          "presentation_rect": [
            32,
            698,
            228,
            28
          ],
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 6,
          "bgcolor": [
            0.8784313725490196,
            0.8980392156862745,
            0.9215686274509803,
            1.0
          ],
          "bgoncolor": [
            0.4823529411764706,
            0.5254901960784314,
            0.5803921568627451,
            1.0
          ],
          "textoncolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "textovercolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "parameter_enable": 0,
          "ignoreclick": 1,
          "fontface": 1,
          "usebgoncolor": 1,
          "usetextovercolor": 1
        }
      },
      {
        "box": {
          "id": "wave_scale",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            468,
            354,
            272,
            24
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.27450980392156865,
            0.3254901960784314,
            0.396078431372549,
            1.0
          ],
          "text": "Wave view 1x",
          "varname": "wave_scale",
          "presentation": 1,
          "presentation_rect": [
            468,
            354,
            272,
            24
          ],
          "hidden": 0,
          "hint": "The waveform is enlarged for visibility only. Audio playback and export levels do not change.",
          "bgcolor": [
            0,
            0,
            0,
            0
          ]
        }
      },
      {
        "box": {
          "id": "audio_ad_driver",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            1460,
            2300,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "adstatus driver",
          "outlettype": [
            "",
            "int"
          ],
          "varname": "audio_ad_driver"
        }
      },
      {
        "box": {
          "id": "audio_menu_driver",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            2340,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "js cmpe_audio_tag.js audiomenu driver",
          "varname": "audio_menu_driver"
        }
      },
      {
        "box": {
          "id": "audio_value_driver",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            2380,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "prepend audiovalue driver",
          "varname": "audio_value_driver"
        }
      },
      {
        "box": {
          "id": "audio_choose_driver",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            2420,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "prepend audiochoose driver",
          "varname": "audio_choose_driver"
        }
      },
      {
        "box": {
          "id": "audio_ad_option1",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            1760,
            2300,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "adstatus option 0",
          "outlettype": [
            "",
            "int"
          ],
          "varname": "audio_ad_option1"
        }
      },
      {
        "box": {
          "id": "audio_menu_option1",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1760,
            2340,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "js cmpe_audio_tag.js audiomenu option1",
          "varname": "audio_menu_option1"
        }
      },
      {
        "box": {
          "id": "audio_value_option1",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1760,
            2380,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "prepend audiovalue option1",
          "varname": "audio_value_option1"
        }
      },
      {
        "box": {
          "id": "audio_choose_option1",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1760,
            2420,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "prepend audiochoose option1",
          "varname": "audio_choose_option1"
        }
      },
      {
        "box": {
          "id": "audio_ad_option2",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            2060,
            2300,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "adstatus option 1",
          "outlettype": [
            "",
            "int"
          ],
          "varname": "audio_ad_option2"
        }
      },
      {
        "box": {
          "id": "audio_menu_option2",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            2060,
            2340,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "js cmpe_audio_tag.js audiomenu option2",
          "varname": "audio_menu_option2"
        }
      },
      {
        "box": {
          "id": "audio_value_option2",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            2060,
            2380,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "prepend audiovalue option2",
          "varname": "audio_value_option2"
        }
      },
      {
        "box": {
          "id": "audio_choose_option2",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            2060,
            2420,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "prepend audiochoose option2",
          "varname": "audio_choose_option2"
        }
      },
      {
        "box": {
          "id": "audio_name_option1",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            1760,
            2480,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "adstatus optionname 0",
          "outlettype": [
            "",
            ""
          ],
          "varname": "audio_name_option1"
        }
      },
      {
        "box": {
          "id": "audio_name_msg1",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1760,
            2520,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "js cmpe_audio_tag.js audioname 1",
          "varname": "audio_name_msg1"
        }
      },
      {
        "box": {
          "id": "audio_name_option2",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            2060,
            2480,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "adstatus optionname 1",
          "outlettype": [
            "",
            ""
          ],
          "varname": "audio_name_option2"
        }
      },
      {
        "box": {
          "id": "audio_name_msg2",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            2060,
            2520,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "js cmpe_audio_tag.js audioname 2",
          "varname": "audio_name_msg2"
        }
      },
      {
        "box": {
          "id": "audio_ad_switch",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            1460,
            2480,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "adstatus switch",
          "outlettype": [
            "",
            "int"
          ],
          "varname": "audio_ad_switch"
        }
      },
      {
        "box": {
          "id": "audio_switch_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            2520,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "prepend audioswitch",
          "varname": "audio_switch_msg"
        }
      },
      {
        "box": {
          "id": "audio_setup_native",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            2570,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "; dsp open",
          "outlettype": [
            ""
          ],
          "varname": "audio_setup_native",
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
          "id": "audio_setup_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            2620,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "audiosetup",
          "outlettype": [
            ""
          ],
          "varname": "audio_setup_msg",
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
          "id": "audio_refresh_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1760,
            2620,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "audiorefresh",
          "outlettype": [
            ""
          ],
          "varname": "audio_refresh_msg",
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
          "id": "audio_power_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            2060,
            2620,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "audiopower",
          "outlettype": [
            ""
          ],
          "varname": "audio_power_msg",
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "savedialog WAVE",
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "record_dialog"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "prepend recordpath",
          "varname": "record_dialog_path"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "savedialog JSON",
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "preset_save_dialog"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "prepend presetwrite",
          "varname": "preset_save_dialog_path"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "opendialog JSON",
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "preset_load_dialog"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "prepend presetread",
          "varname": "preset_load_dialog_path"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
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
          ]
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
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
          ]
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "poly~ cmpe_sample_voice 3",
          "outlettype": [
            "signal",
            "signal"
          ],
          "varname": "grain_engine"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "poly~ cmpe_many_voice 32",
          "outlettype": [
            "signal",
            "signal"
          ],
          "varname": "many_engine"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "poly~ cmpe_drone_voice 64",
          "outlettype": [
            "signal",
            "signal"
          ],
          "varname": "drone_engine"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "line~ 0.",
          "outlettype": [
            "signal",
            "bang"
          ],
          "varname": "live_gate"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "sfrecord~ 2",
          "outlettype": [
            "signal"
          ],
          "varname": "recorder"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "snapshot~ 250",
          "outlettype": [
            "float"
          ],
          "varname": "record_snapshot"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "prepend recordelapsed",
          "varname": "record_elapsed_msg"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ],
          "varname": "live_pair_L"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ],
          "varname": "live_sum_L"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ],
          "varname": "live_L"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ],
          "varname": "program_L"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ],
          "varname": "live_pair_R"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ],
          "varname": "live_sum_R"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ],
          "varname": "live_R"
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
          "fontsize": 17.0,
          "textcolor": [
            0.09019607843137255,
            0.12549019607843137,
            0.16862745098039217,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ],
          "varname": "program_R"
        }
      },
      {
        "box": {
          "id": "fx_bus",
          "maxclass": "newobj",
          "patching_rect": [
            1600,
            1100,
            130,
            22
          ],
          "text": "cmpe_fx_bus",
          "varname": "fx_bus"
        }
      },
      {
        "box": {
          "id": "fxopen",
          "maxclass": "textbutton",
          "patching_rect": [
            398,
            12,
            208,
            32
          ],
          "text": "TAPE + MEMORY",
          "varname": "fxopen",
          "presentation": 1,
          "presentation_rect": [
            398,
            12,
            208,
            32
          ],
          "texton": "TAPE + MEMORY",
          "bgcolor": [
            0.16,
            0.25,
            0.34,
            1
          ],
          "textcolor": [
            1,
            1,
            1,
            1
          ],
          "fontsize": 15,
          "fontface": 1,
          "parameter_enable": 0
        }
      },
      {
        "box": {
          "id": "fxpcontrol",
          "maxclass": "newobj",
          "patching_rect": [
            1600,
            1150,
            80,
            22
          ],
          "text": "pcontrol",
          "varname": "fxpcontrol"
        }
      },
      {
        "box": {
          "id": "fxopenmsg",
          "maxclass": "message",
          "patching_rect": [
            1500,
            1150,
            60,
            22
          ],
          "text": "open"
        }
      },
      {
        "box": {
          "id": "choose_sample1",
          "maxclass": "message",
          "text": "choosefile 0",
          "patching_rect": [
            1240,
            1500,
            130,
            22
          ]
        }
      },
      {
        "box": {
          "id": "choose_sample2",
          "maxclass": "message",
          "text": "choosefile 1",
          "patching_rect": [
            1380,
            1500,
            130,
            22
          ]
        }
      },
      {
        "box": {
          "id": "choose_sample3",
          "maxclass": "message",
          "text": "choosefile 2",
          "patching_rect": [
            1520,
            1500,
            130,
            22
          ]
        }
      },
      {
        "box": {
          "id": "advanced_panel",
          "maxclass": "newobj",
          "patching_rect": [
            1600,
            1350,
            180,
            22
          ],
          "text": "p APG Advanced",
          "varname": "advanced_panel",
          "patcher": {
            "fileversion": 1,
            "classnamespace": "box",
            "rect": [
              170,
              140,
              1000,
              340
            ],
            "openinpresentation": 1,
            "title": "CMPE / APG Advanced",
            "bgcolor": [
              0.06,
              0.08,
              0.11,
              1
            ],
            "default_fontsize": 14,
            "boxes": [
              {
                "box": {
                  "id": "adv_bg",
                  "maxclass": "panel",
                  "patching_rect": [
                    16,
                    16,
                    968,
                    258
                  ],
                  "presentation": 1,
                  "presentation_rect": [
                    16,
                    16,
                    968,
                    258
                  ],
                  "varname": "adv_bg",
                  "bgcolor": [
                    0.085,
                    0.12,
                    0.17,
                    1
                  ],
                  "background": 1,
                  "ignoreclick": 1,
                  "rounded": 12
                }
              },
              {
                "box": {
                  "id": "adv_title",
                  "maxclass": "comment",
                  "patching_rect": [
                    34,
                    28,
                    420,
                    32
                  ],
                  "text": "APG / ADVANCED",
                  "presentation": 1,
                  "presentation_rect": [
                    34,
                    28,
                    420,
                    32
                  ],
                  "varname": "adv_title",
                  "fontsize": 24,
                  "textcolor": [
                    0.91,
                    0.94,
                    0.98,
                    1
                  ],
                  "ignoreclick": 1
                }
              },
              {
                "box": {
                  "id": "adv_note",
                  "maxclass": "comment",
                  "patching_rect": [
                    34,
                    64,
                    920,
                    22
                  ],
                  "text": "Changes affect the next generated take. Tape and Memory are unchanged.",
                  "presentation": 1,
                  "presentation_rect": [
                    34,
                    64,
                    920,
                    22
                  ],
                  "varname": "adv_note",
                  "fontsize": 13,
                  "textcolor": [
                    0.58,
                    0.68,
                    0.79,
                    1
                  ],
                  "ignoreclick": 1
                }
              },
              {
                "box": {
                  "id": "adv_length_label",
                  "maxclass": "comment",
                  "patching_rect": [
                    36,
                    104,
                    232,
                    22
                  ],
                  "text": "COMPOSITION LENGTH",
                  "presentation": 1,
                  "presentation_rect": [
                    36,
                    104,
                    232,
                    22
                  ],
                  "varname": "adv_length_label",
                  "fontsize": 13,
                  "textcolor": [
                    0.91,
                    0.94,
                    0.98,
                    1
                  ],
                  "ignoreclick": 1
                }
              },
              {
                "box": {
                  "id": "adv_auto",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    36,
                    136,
                    118,
                    30
                  ],
                  "text": "AUTO LENGTH",
                  "presentation": 1,
                  "presentation_rect": [
                    36,
                    136,
                    118,
                    30
                  ],
                  "varname": "adv_auto",
                  "mode": 1,
                  "outputmode": 1,
                  "texton": "AUTO LENGTH",
                  "fontsize": 13,
                  "fontface": 1,
                  "bgcolor": [
                    0.14,
                    0.2,
                    0.28,
                    1
                  ],
                  "bgoncolor": [
                    0.25,
                    0.57,
                    0.86,
                    1
                  ],
                  "textcolor": [
                    0.94,
                    0.96,
                    1,
                    1
                  ],
                  "textoncolor": [
                    1,
                    1,
                    1,
                    1
                  ],
                  "parameter_enable": 0
                }
              },
              {
                "box": {
                  "id": "cmd_adv_auto",
                  "maxclass": "newobj",
                  "patching_rect": [
                    30,
                    420,
                    220,
                    22
                  ],
                  "text": "prepend apgadv auto"
                }
              },
              {
                "box": {
                  "id": "adv_seconds",
                  "maxclass": "flonum",
                  "patching_rect": [
                    166,
                    136,
                    96,
                    30
                  ],
                  "presentation": 1,
                  "presentation_rect": [
                    166,
                    136,
                    96,
                    30
                  ],
                  "varname": "adv_seconds",
                  "minimum": 0.1,
                  "maximum": 600.0,
                  "fontsize": 18,
                  "parameter_enable": 0,
                  "bgcolor": [
                    0.16,
                    0.21,
                    0.28,
                    1
                  ],
                  "textcolor": [
                    1,
                    1,
                    1,
                    1
                  ]
                }
              },
              {
                "box": {
                  "id": "cmd_adv_seconds",
                  "maxclass": "newobj",
                  "patching_rect": [
                    30,
                    428,
                    220,
                    22
                  ],
                  "text": "prepend apgadv length"
                }
              },
              {
                "box": {
                  "id": "adv_seconds_unit",
                  "maxclass": "comment",
                  "patching_rect": [
                    166,
                    172,
                    100,
                    20
                  ],
                  "text": "seconds",
                  "presentation": 1,
                  "presentation_rect": [
                    166,
                    172,
                    100,
                    20
                  ],
                  "varname": "adv_seconds_unit",
                  "fontsize": 12,
                  "textcolor": [
                    0.58,
                    0.68,
                    0.79,
                    1
                  ],
                  "ignoreclick": 1
                }
              },
              {
                "box": {
                  "id": "adv_length_help",
                  "maxclass": "comment",
                  "patching_rect": [
                    36,
                    208,
                    240,
                    40
                  ],
                  "text": "Auto = 2 \u00d7 longest sample",
                  "presentation": 1,
                  "presentation_rect": [
                    36,
                    208,
                    240,
                    40
                  ],
                  "varname": "adv_length_help",
                  "fontsize": 12,
                  "textcolor": [
                    0.58,
                    0.68,
                    0.79,
                    1
                  ],
                  "ignoreclick": 1
                }
              },
              {
                "box": {
                  "id": "adv_level_label0",
                  "maxclass": "comment",
                  "patching_rect": [
                    300,
                    104,
                    164,
                    22
                  ],
                  "text": "SAMPLE 1 LEVEL",
                  "presentation": 1,
                  "presentation_rect": [
                    300,
                    104,
                    164,
                    22
                  ],
                  "varname": "adv_level_label0",
                  "fontsize": 13,
                  "textcolor": [
                    0.91,
                    0.94,
                    0.98,
                    1
                  ],
                  "ignoreclick": 1
                }
              },
              {
                "box": {
                  "id": "adv_slider0",
                  "maxclass": "slider",
                  "patching_rect": [
                    300,
                    140,
                    150,
                    20
                  ],
                  "presentation": 1,
                  "presentation_rect": [
                    300,
                    140,
                    150,
                    20
                  ],
                  "varname": "adv_slider0",
                  "size": 201.0,
                  "floatoutput": 1,
                  "orientation": 1,
                  "parameter_enable": 0,
                  "bgcolor": [
                    0.18,
                    0.25,
                    0.33,
                    1
                  ],
                  "knobcolor": [
                    0.43,
                    0.73,
                    0.96,
                    1
                  ]
                }
              },
              {
                "box": {
                  "id": "cmd_adv_slider0",
                  "maxclass": "newobj",
                  "patching_rect": [
                    30,
                    436,
                    220,
                    22
                  ],
                  "text": "prepend apgadv level0"
                }
              },
              {
                "box": {
                  "id": "adv_level0",
                  "maxclass": "flonum",
                  "patching_rect": [
                    300,
                    174,
                    96,
                    30
                  ],
                  "presentation": 1,
                  "presentation_rect": [
                    300,
                    174,
                    96,
                    30
                  ],
                  "varname": "adv_level0",
                  "minimum": 0.0,
                  "maximum": 200.0,
                  "fontsize": 18,
                  "parameter_enable": 0,
                  "bgcolor": [
                    0.16,
                    0.21,
                    0.28,
                    1
                  ],
                  "textcolor": [
                    1,
                    1,
                    1,
                    1
                  ]
                }
              },
              {
                "box": {
                  "id": "cmd_adv_level0",
                  "maxclass": "newobj",
                  "patching_rect": [
                    30,
                    444,
                    220,
                    22
                  ],
                  "text": "prepend apgadv level0"
                }
              },
              {
                "box": {
                  "id": "adv_pct0",
                  "maxclass": "comment",
                  "patching_rect": [
                    404,
                    180,
                    30,
                    20
                  ],
                  "text": "%",
                  "presentation": 1,
                  "presentation_rect": [
                    404,
                    180,
                    30,
                    20
                  ],
                  "varname": "adv_pct0",
                  "fontsize": 13,
                  "textcolor": [
                    0.58,
                    0.68,
                    0.79,
                    1
                  ],
                  "ignoreclick": 1
                }
              },
              {
                "box": {
                  "id": "adv_level_help0",
                  "maxclass": "comment",
                  "patching_rect": [
                    300,
                    213,
                    170,
                    26
                  ],
                  "text": "0 = mute \u00b7 100 = original",
                  "presentation": 1,
                  "presentation_rect": [
                    300,
                    213,
                    170,
                    26
                  ],
                  "varname": "adv_level_help0",
                  "fontsize": 11,
                  "textcolor": [
                    0.58,
                    0.68,
                    0.79,
                    1
                  ],
                  "ignoreclick": 1
                }
              },
              {
                "box": {
                  "id": "adv_level_label1",
                  "maxclass": "comment",
                  "patching_rect": [
                    486,
                    104,
                    164,
                    22
                  ],
                  "text": "SAMPLE 2 LEVEL",
                  "presentation": 1,
                  "presentation_rect": [
                    486,
                    104,
                    164,
                    22
                  ],
                  "varname": "adv_level_label1",
                  "fontsize": 13,
                  "textcolor": [
                    0.91,
                    0.94,
                    0.98,
                    1
                  ],
                  "ignoreclick": 1
                }
              },
              {
                "box": {
                  "id": "adv_slider1",
                  "maxclass": "slider",
                  "patching_rect": [
                    486,
                    140,
                    150,
                    20
                  ],
                  "presentation": 1,
                  "presentation_rect": [
                    486,
                    140,
                    150,
                    20
                  ],
                  "varname": "adv_slider1",
                  "size": 201.0,
                  "floatoutput": 1,
                  "orientation": 1,
                  "parameter_enable": 0,
                  "bgcolor": [
                    0.18,
                    0.25,
                    0.33,
                    1
                  ],
                  "knobcolor": [
                    0.43,
                    0.73,
                    0.96,
                    1
                  ]
                }
              },
              {
                "box": {
                  "id": "cmd_adv_slider1",
                  "maxclass": "newobj",
                  "patching_rect": [
                    30,
                    452,
                    220,
                    22
                  ],
                  "text": "prepend apgadv level1"
                }
              },
              {
                "box": {
                  "id": "adv_level1",
                  "maxclass": "flonum",
                  "patching_rect": [
                    486,
                    174,
                    96,
                    30
                  ],
                  "presentation": 1,
                  "presentation_rect": [
                    486,
                    174,
                    96,
                    30
                  ],
                  "varname": "adv_level1",
                  "minimum": 0.0,
                  "maximum": 200.0,
                  "fontsize": 18,
                  "parameter_enable": 0,
                  "bgcolor": [
                    0.16,
                    0.21,
                    0.28,
                    1
                  ],
                  "textcolor": [
                    1,
                    1,
                    1,
                    1
                  ]
                }
              },
              {
                "box": {
                  "id": "cmd_adv_level1",
                  "maxclass": "newobj",
                  "patching_rect": [
                    30,
                    460,
                    220,
                    22
                  ],
                  "text": "prepend apgadv level1"
                }
              },
              {
                "box": {
                  "id": "adv_pct1",
                  "maxclass": "comment",
                  "patching_rect": [
                    590,
                    180,
                    30,
                    20
                  ],
                  "text": "%",
                  "presentation": 1,
                  "presentation_rect": [
                    590,
                    180,
                    30,
                    20
                  ],
                  "varname": "adv_pct1",
                  "fontsize": 13,
                  "textcolor": [
                    0.58,
                    0.68,
                    0.79,
                    1
                  ],
                  "ignoreclick": 1
                }
              },
              {
                "box": {
                  "id": "adv_level_help1",
                  "maxclass": "comment",
                  "patching_rect": [
                    486,
                    213,
                    170,
                    26
                  ],
                  "text": "0 = mute \u00b7 100 = original",
                  "presentation": 1,
                  "presentation_rect": [
                    486,
                    213,
                    170,
                    26
                  ],
                  "varname": "adv_level_help1",
                  "fontsize": 11,
                  "textcolor": [
                    0.58,
                    0.68,
                    0.79,
                    1
                  ],
                  "ignoreclick": 1
                }
              },
              {
                "box": {
                  "id": "adv_level_label2",
                  "maxclass": "comment",
                  "patching_rect": [
                    672,
                    104,
                    164,
                    22
                  ],
                  "text": "SAMPLE 3 LEVEL",
                  "presentation": 1,
                  "presentation_rect": [
                    672,
                    104,
                    164,
                    22
                  ],
                  "varname": "adv_level_label2",
                  "fontsize": 13,
                  "textcolor": [
                    0.91,
                    0.94,
                    0.98,
                    1
                  ],
                  "ignoreclick": 1
                }
              },
              {
                "box": {
                  "id": "adv_slider2",
                  "maxclass": "slider",
                  "patching_rect": [
                    672,
                    140,
                    150,
                    20
                  ],
                  "presentation": 1,
                  "presentation_rect": [
                    672,
                    140,
                    150,
                    20
                  ],
                  "varname": "adv_slider2",
                  "size": 201.0,
                  "floatoutput": 1,
                  "orientation": 1,
                  "parameter_enable": 0,
                  "bgcolor": [
                    0.18,
                    0.25,
                    0.33,
                    1
                  ],
                  "knobcolor": [
                    0.43,
                    0.73,
                    0.96,
                    1
                  ]
                }
              },
              {
                "box": {
                  "id": "cmd_adv_slider2",
                  "maxclass": "newobj",
                  "patching_rect": [
                    30,
                    468,
                    220,
                    22
                  ],
                  "text": "prepend apgadv level2"
                }
              },
              {
                "box": {
                  "id": "adv_level2",
                  "maxclass": "flonum",
                  "patching_rect": [
                    672,
                    174,
                    96,
                    30
                  ],
                  "presentation": 1,
                  "presentation_rect": [
                    672,
                    174,
                    96,
                    30
                  ],
                  "varname": "adv_level2",
                  "minimum": 0.0,
                  "maximum": 200.0,
                  "fontsize": 18,
                  "parameter_enable": 0,
                  "bgcolor": [
                    0.16,
                    0.21,
                    0.28,
                    1
                  ],
                  "textcolor": [
                    1,
                    1,
                    1,
                    1
                  ]
                }
              },
              {
                "box": {
                  "id": "cmd_adv_level2",
                  "maxclass": "newobj",
                  "patching_rect": [
                    30,
                    476,
                    220,
                    22
                  ],
                  "text": "prepend apgadv level2"
                }
              },
              {
                "box": {
                  "id": "adv_pct2",
                  "maxclass": "comment",
                  "patching_rect": [
                    776,
                    180,
                    30,
                    20
                  ],
                  "text": "%",
                  "presentation": 1,
                  "presentation_rect": [
                    776,
                    180,
                    30,
                    20
                  ],
                  "varname": "adv_pct2",
                  "fontsize": 13,
                  "textcolor": [
                    0.58,
                    0.68,
                    0.79,
                    1
                  ],
                  "ignoreclick": 1
                }
              },
              {
                "box": {
                  "id": "adv_level_help2",
                  "maxclass": "comment",
                  "patching_rect": [
                    672,
                    213,
                    170,
                    26
                  ],
                  "text": "0 = mute \u00b7 100 = original",
                  "presentation": 1,
                  "presentation_rect": [
                    672,
                    213,
                    170,
                    26
                  ],
                  "varname": "adv_level_help2",
                  "fontsize": 11,
                  "textcolor": [
                    0.58,
                    0.68,
                    0.79,
                    1
                  ],
                  "ignoreclick": 1
                }
              },
              {
                "box": {
                  "id": "adv_lock_label",
                  "maxclass": "comment",
                  "patching_rect": [
                    852,
                    104,
                    122,
                    22
                  ],
                  "text": "VARIATION",
                  "presentation": 1,
                  "presentation_rect": [
                    852,
                    104,
                    122,
                    22
                  ],
                  "varname": "adv_lock_label",
                  "fontsize": 13,
                  "textcolor": [
                    0.91,
                    0.94,
                    0.98,
                    1
                  ],
                  "ignoreclick": 1
                }
              },
              {
                "box": {
                  "id": "adv_lock",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    852,
                    136,
                    118,
                    34
                  ],
                  "text": "LOCK VARIATION",
                  "presentation": 1,
                  "presentation_rect": [
                    852,
                    136,
                    118,
                    34
                  ],
                  "varname": "adv_lock",
                  "mode": 1,
                  "outputmode": 1,
                  "texton": "LOCK VARIATION",
                  "fontsize": 13,
                  "fontface": 1,
                  "bgcolor": [
                    0.14,
                    0.2,
                    0.28,
                    1
                  ],
                  "bgoncolor": [
                    0.25,
                    0.57,
                    0.86,
                    1
                  ],
                  "textcolor": [
                    0.94,
                    0.96,
                    1,
                    1
                  ],
                  "textoncolor": [
                    1,
                    1,
                    1,
                    1
                  ],
                  "parameter_enable": 0
                }
              },
              {
                "box": {
                  "id": "cmd_adv_lock",
                  "maxclass": "newobj",
                  "patching_rect": [
                    30,
                    484,
                    220,
                    22
                  ],
                  "text": "prepend apgadv lock"
                }
              },
              {
                "box": {
                  "id": "adv_seed",
                  "maxclass": "comment",
                  "patching_rect": [
                    852,
                    179,
                    122,
                    34
                  ],
                  "text": "Seed 1234567",
                  "presentation": 1,
                  "presentation_rect": [
                    852,
                    179,
                    122,
                    34
                  ],
                  "varname": "adv_seed",
                  "fontsize": 11,
                  "textcolor": [
                    0.58,
                    0.68,
                    0.79,
                    1
                  ],
                  "ignoreclick": 1
                }
              },
              {
                "box": {
                  "id": "adv_new",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    852,
                    220,
                    118,
                    30
                  ],
                  "text": "NEW VARIATION",
                  "presentation": 1,
                  "presentation_rect": [
                    852,
                    220,
                    118,
                    30
                  ],
                  "varname": "adv_new",
                  "mode": 0,
                  "outputmode": 1,
                  "texton": "NEW VARIATION",
                  "fontsize": 13,
                  "fontface": 1,
                  "bgcolor": [
                    0.14,
                    0.2,
                    0.28,
                    1
                  ],
                  "bgoncolor": [
                    0.25,
                    0.57,
                    0.86,
                    1
                  ],
                  "textcolor": [
                    0.94,
                    0.96,
                    1,
                    1
                  ],
                  "textoncolor": [
                    1,
                    1,
                    1,
                    1
                  ],
                  "parameter_enable": 0
                }
              },
              {
                "box": {
                  "id": "cmd_adv_new",
                  "maxclass": "newobj",
                  "patching_rect": [
                    30,
                    492,
                    220,
                    22
                  ],
                  "text": "prepend apgadv new"
                }
              },
              {
                "box": {
                  "id": "adv_status",
                  "maxclass": "comment",
                  "patching_rect": [
                    28,
                    286,
                    940,
                    38
                  ],
                  "text": "Select APG and stop playback to edit these settings.",
                  "presentation": 1,
                  "presentation_rect": [
                    28,
                    286,
                    940,
                    38
                  ],
                  "varname": "adv_status",
                  "fontsize": 13,
                  "textcolor": [
                    0.7,
                    0.79,
                    0.88,
                    1
                  ],
                  "ignoreclick": 1
                }
              },
              {
                "box": {
                  "id": "out",
                  "maxclass": "outlet",
                  "patching_rect": [
                    620,
                    640,
                    25,
                    25
                  ],
                  "index": 1
                }
              },
              {
                "box": {
                  "id": "load",
                  "maxclass": "newobj",
                  "patching_rect": [
                    760,
                    420,
                    160,
                    22
                  ],
                  "text": "loadmess locked 1"
                }
              },
              {
                "box": {
                  "id": "window",
                  "maxclass": "newobj",
                  "patching_rect": [
                    760,
                    460,
                    100,
                    22
                  ],
                  "text": "thispatcher"
                }
              }
            ],
            "lines": [
              {
                "patchline": {
                  "source": [
                    "adv_auto",
                    0
                  ],
                  "destination": [
                    "cmd_adv_auto",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "cmd_adv_auto",
                    0
                  ],
                  "destination": [
                    "out",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "adv_seconds",
                    0
                  ],
                  "destination": [
                    "cmd_adv_seconds",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "cmd_adv_seconds",
                    0
                  ],
                  "destination": [
                    "out",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "adv_slider0",
                    0
                  ],
                  "destination": [
                    "cmd_adv_slider0",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "cmd_adv_slider0",
                    0
                  ],
                  "destination": [
                    "out",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "adv_level0",
                    0
                  ],
                  "destination": [
                    "cmd_adv_level0",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "cmd_adv_level0",
                    0
                  ],
                  "destination": [
                    "out",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "adv_slider1",
                    0
                  ],
                  "destination": [
                    "cmd_adv_slider1",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "cmd_adv_slider1",
                    0
                  ],
                  "destination": [
                    "out",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "adv_level1",
                    0
                  ],
                  "destination": [
                    "cmd_adv_level1",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "cmd_adv_level1",
                    0
                  ],
                  "destination": [
                    "out",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "adv_slider2",
                    0
                  ],
                  "destination": [
                    "cmd_adv_slider2",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "cmd_adv_slider2",
                    0
                  ],
                  "destination": [
                    "out",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "adv_level2",
                    0
                  ],
                  "destination": [
                    "cmd_adv_level2",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "cmd_adv_level2",
                    0
                  ],
                  "destination": [
                    "out",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "adv_lock",
                    0
                  ],
                  "destination": [
                    "cmd_adv_lock",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "cmd_adv_lock",
                    0
                  ],
                  "destination": [
                    "out",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "adv_new",
                    0
                  ],
                  "destination": [
                    "cmd_adv_new",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "cmd_adv_new",
                    0
                  ],
                  "destination": [
                    "out",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "load",
                    0
                  ],
                  "destination": [
                    "window",
                    0
                  ]
                }
              }
            ]
          }
        }
      },
      {
        "box": {
          "id": "advanced_button",
          "maxclass": "textbutton",
          "patching_rect": [
            278,
            12,
            112,
            32
          ],
          "text": "ADVANCED",
          "varname": "advanced_button",
          "presentation": 1,
          "presentation_rect": [
            278,
            12,
            112,
            32
          ],
          "fontsize": 12,
          "fontface": 1,
          "mode": 0,
          "outputmode": 1,
          "bgcolor": [
            0.17,
            0.25,
            0.34,
            1
          ],
          "textcolor": [
            1,
            1,
            1,
            1
          ],
          "parameter_enable": 0
        }
      },
      {
        "box": {
          "id": "advanced_open",
          "maxclass": "message",
          "patching_rect": [
            1600,
            1400,
            80,
            22
          ],
          "text": "open"
        }
      },
      {
        "box": {
          "id": "advanced_pcontrol",
          "maxclass": "newobj",
          "patching_rect": [
            1700,
            1400,
            80,
            22
          ],
          "text": "pcontrol",
          "varname": "advanced_pcontrol"
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
            "test_audio",
            0
          ],
          "destination": [
            "test_trigger",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "test_trigger",
            2
          ],
          "destination": [
            "audio_on",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "audio_on",
            0
          ],
          "destination": [
            "audio_driver",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "test_trigger",
            1
          ],
          "destination": [
            "test_status",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "test_status",
            0
          ],
          "destination": [
            "status",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "test_trigger",
            0
          ],
          "destination": [
            "test_delay",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "test_delay",
            0
          ],
          "destination": [
            "test_envelope_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "test_envelope_msg",
            0
          ],
          "destination": [
            "test_envelope",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "test_envelope",
            0
          ],
          "destination": [
            "test_product",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "test_oscillator",
            0
          ],
          "destination": [
            "test_product",
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
            2
          ],
          "destination": [
            "test_stop_delay",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "test_stop_delay",
            0
          ],
          "destination": [
            "test_delay",
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
            "test_envelope",
            0
          ],
          "order": 0
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
            "test_product",
            0
          ],
          "destination": [
            "listen_sum_L",
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
            "monitor_L",
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
            "monitor_L",
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
            "test_product",
            0
          ],
          "destination": [
            "listen_sum_R",
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
            "monitor_R",
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
            "monitor_R",
            0
          ],
          "destination": [
            "audio_driver",
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
            "audio_ad_driver",
            0
          ],
          "destination": [
            "audio_driver_menu",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "audio_ad_driver",
            0
          ],
          "destination": [
            "audio_menu_driver",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "audio_ad_driver",
            1
          ],
          "destination": [
            "audio_value_driver",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "audio_menu_driver",
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
            "audio_value_driver",
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
            "audio_driver_menu",
            0
          ],
          "destination": [
            "audio_choose_driver",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "audio_choose_driver",
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
            "audio_ad_option1",
            0
          ],
          "destination": [
            "audio_option1_menu",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "audio_ad_option1",
            0
          ],
          "destination": [
            "audio_menu_option1",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "audio_ad_option1",
            1
          ],
          "destination": [
            "audio_value_option1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "audio_menu_option1",
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
            "audio_value_option1",
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
            "audio_option1_menu",
            0
          ],
          "destination": [
            "audio_choose_option1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "audio_choose_option1",
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
            "audio_ad_option2",
            0
          ],
          "destination": [
            "audio_option2_menu",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "audio_ad_option2",
            0
          ],
          "destination": [
            "audio_menu_option2",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "audio_ad_option2",
            1
          ],
          "destination": [
            "audio_value_option2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "audio_menu_option2",
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
            "audio_value_option2",
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
            "audio_option2_menu",
            0
          ],
          "destination": [
            "audio_choose_option2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "audio_choose_option2",
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
            "audio_name_option1",
            0
          ],
          "destination": [
            "audio_name_msg1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "audio_name_msg1",
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
            "audio_name_option2",
            0
          ],
          "destination": [
            "audio_name_msg2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "audio_name_msg2",
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
            "audio_ad_switch",
            1
          ],
          "destination": [
            "audio_switch_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "audio_switch_msg",
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
            "audio_setup",
            0
          ],
          "destination": [
            "audio_setup_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "audio_setup_msg",
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
            "audio_refresh",
            0
          ],
          "destination": [
            "audio_refresh_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "audio_refresh_msg",
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
            "audio_power",
            0
          ],
          "destination": [
            "audio_power_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "audio_power_msg",
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
            "program_L",
            0
          ],
          "destination": [
            "fx_bus",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "fx_bus",
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
            "program_R",
            0
          ],
          "destination": [
            "fx_bus",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "fx_bus",
            1
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
            "fx_bus",
            2
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
            "recordtoggle_msg",
            0
          ],
          "destination": [
            "fx_bus",
            2
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "fxopen",
            0
          ],
          "destination": [
            "fxopenmsg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "fxopenmsg",
            0
          ],
          "destination": [
            "fxpcontrol",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "fxpcontrol",
            0
          ],
          "destination": [
            "fx_bus",
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
            "choose_sample1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "choose_sample1",
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
            "choose_sample2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "choose_sample2",
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
            "choose_sample3",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "choose_sample3",
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
            "advanced_button",
            0
          ],
          "destination": [
            "advanced_open",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "advanced_open",
            0
          ],
          "destination": [
            "advanced_pcontrol",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "advanced_pcontrol",
            0
          ],
          "destination": [
            "advanced_panel",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "advanced_panel",
            0
          ],
          "destination": [
            "controller",
            0
          ]
        }
      }
    ],
    "autosave": 0,
    "dependency_cache": [
      {
        "name": "cmpe_advanced_variety.js",
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
        "name": "cmpe_fx_bus.maxpat",
        "type": "JSON",
        "implicit": 1
      },
      {
        "name": "cmpe_fx_tape.maxpat",
        "type": "JSON",
        "implicit": 1
      },
      {
        "name": "cmpe_fx_memory.maxpat",
        "type": "JSON",
        "implicit": 1
      },
      {
        "name": "cmpe_fx_control.js",
        "type": "TEXT",
        "implicit": 1
      },
      {
        "name": "cmpe_fx_ui.js",
        "type": "TEXT",
        "implicit": 1
      },
      {
        "name": "cmpe_audio_tag.js",
        "type": "TEXT",
        "implicit": 1
      }
    ],
    "styles": [
      {
        "name": "CMPE_Solid_123_134_148_255",
        "default": {
          "bgfillcolor": {
            "type": "color",
            "color": [
              0.4823529411764706,
              0.5254901960784314,
              0.5803921568627451,
              1.0
            ],
            "color1": [
              0.4823529411764706,
              0.5254901960784314,
              0.5803921568627451,
              1.0
            ],
            "color2": [
              0.4823529411764706,
              0.5254901960784314,
              0.5803921568627451,
              1.0
            ],
            "angle": 270.0,
            "proportion": 0.5,
            "autogradient": 0.0
          }
        },
        "parentstyle": "",
        "multi": 0
      },
      {
        "name": "CMPE_Solid_224_229_235_255",
        "default": {
          "bgfillcolor": {
            "type": "color",
            "color": [
              0.8784313725490196,
              0.8980392156862745,
              0.9215686274509803,
              1.0
            ],
            "color1": [
              0.8784313725490196,
              0.8980392156862745,
              0.9215686274509803,
              1.0
            ],
            "color2": [
              0.8784313725490196,
              0.8980392156862745,
              0.9215686274509803,
              1.0
            ],
            "angle": 270.0,
            "proportion": 0.5,
            "autogradient": 0.0
          }
        },
        "parentstyle": "",
        "multi": 0
      },
      {
        "name": "CMPE_Solid_255_255_255_255",
        "default": {
          "bgfillcolor": {
            "type": "color",
            "color": [
              1.0,
              1.0,
              1.0,
              1.0
            ],
            "color1": [
              1.0,
              1.0,
              1.0,
              1.0
            ],
            "color2": [
              1.0,
              1.0,
              1.0,
              1.0
            ],
            "angle": 270.0,
            "proportion": 0.5,
            "autogradient": 0.0
          }
        },
        "parentstyle": "",
        "multi": 0
      },
      {
        "name": "CMPE_Solid_38_49_64_255",
        "default": {
          "bgfillcolor": {
            "type": "color",
            "color": [
              0.14901960784313725,
              0.19215686274509805,
              0.25098039215686274,
              1.0
            ],
            "color1": [
              0.14901960784313725,
              0.19215686274509805,
              0.25098039215686274,
              1.0
            ],
            "color2": [
              0.14901960784313725,
              0.19215686274509805,
              0.25098039215686274,
              1.0
            ],
            "angle": 270.0,
            "proportion": 0.5,
            "autogradient": 0.0
          }
        },
        "parentstyle": "",
        "multi": 0
      }
    ]
  }
}
