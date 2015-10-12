var bgColor = [0.6, 0.6, 0.6, 1];
var grayColor = [0.1568627451,0.1568627451,0.1568627451,1.];
var lightColor = [1, 1, 1, 1];
var mainColor = [73/255, 179/255, 122/255, 1];
var titleBgColor = [0.1568627451,0.1568627451,0.1568627451,1.];

function set_main_color(r, g, b, a)
{
    mainColor[0] = r;
    mainColor[1] = g;
    mainColor[2] = b;
    mainColor[3] = a;
    mgraphics.redraw();
}

function set_title_bg_color(r, g, b, a)
{
    titleBgColor[0] = r;
    titleBgColor[1] = g;
    titleBgColor[2] = b;
    titleBgColor[3] = a;
    mgraphics.redraw();
}

function set_light_color(r, g, b, a)
{
    lightColor[0] = r;
    lightColor[1] = g;
    lightColor[2] = b;
    lightColor[3] = a;
    mgraphics.redraw();
}

function set_bg_color(r, g, b, a)
{
    bgColor[0] = r;
    bgColor[1] = g;
    bgColor[2] = b;
    bgColor[3] = a;
    mgraphics.redraw();
}

function set_black_color(r, g, b, a)
{
    grayColor[0] = r;
    grayColor[1] = g;
    grayColor[2] = b;
    grayColor[3] = a;
    mgraphics.redraw();
}