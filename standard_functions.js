var lineThickness = 1;
var font_size = 9;
var font_mini = 7;
var font_toggles = 10;
var font_in_use = "Arial Bold";
var triangleDim = [8, 3];
var rowsHeight = 17;
var thisOffset = [4, 2, 1];

function draw_adsr(attackValue, decayValue, sustainValue, releaseValue, expValue, x, y, w, h, sectionsWidth, upsamp)
{
    with (mgraphics) {
        var phase = 0;
        for (i=0; i<w*upsamp; i++) {
            phase = i/upsamp;
            if (phase<attackValue) { //attack
                line_to(phase, h-Math.pow(phase/attackValue,expValue)*h);
            } else if (phase<(decayValue+attackValue)) { //decay
                line_to(phase, Math.pow((phase-attackValue)/decayValue,expValue)*h*(1-sustainValue));
            } else if (phase<sectionsWidth+decayValue+attackValue) { //sustain
                line_to(phase, h*(1-sustainValue));
            } else if (phase<(sectionsWidth+decayValue+attackValue+releaseValue)) { //release
                line_to(phase, h*(1-sustainValue+Math.pow((phase-(attackValue+decayValue+sectionsWidth))/releaseValue,expValue)*sustainValue));
            } else { break;}
        }
        line_to(attackValue+decayValue+releaseValue+sectionsWidth, h);
    }
}

function draw_dahr(delayValue, attackValue, holdValue, releaseValue, expValue, x, y, w, h, sectionsWidth, upsamp)
{
    with (mgraphics) {
        var phase = 0;
        for (i=0; i<w*upsamp; i++) {
            phase = i/upsamp;
            if (phase<delayValue) {
                line_to(phase, h);
            } else if (phase<(attackValue+delayValue)) { //attack
                line_to(phase, h-Math.pow((phase-delayValue)/attackValue,expValue)*h);
            } else if (phase<(delayValue+attackValue+holdValue)) { //decay
                line_to(phase, y);
            } else if (phase<holdValue+delayValue+attackValue+releaseValue) { //sustain
                line_to(phase, h*Math.pow((phase-(delayValue+attackValue+holdValue))/releaseValue,expValue));
            } else { break;}
        }
        line_to(delayValue+attackValue+holdValue+releaseValue, h);
    }
}


function drawRangeMinMax (x, y, width, color, backgroundColor, name1, name2)
{
    with (mgraphics) {
        var textWidth = 10;
        var heightRange = 2;
        var widthRange = 6;
        var textOffset = 0;
        if (name1!=0 && name2!=0) {
            textOffset = textWidth;
        }
        set_source_rgba(color);
        rectangle(x, y, width, rowsHeight);
        fill();
        
        set_source_rgba(backgroundColor);
        move_to(x+textOffset, y+heightRange+lineThickness/2);
        rel_line_to((width-widthRange)/2-textOffset, 0);
        line_to(x+width-(width-widthRange)/2, y+rowsHeight-heightRange-lineThickness/2);
        rel_line_to((width-widthRange)/2-textOffset, 0);
        path_roundcorners((rowsHeight-heightRange*2)/2);
        stroke();
        if (name1!=0 && name2!=0) {
            write_text (-y-rowsHeight/2, x+textWidth/2, lightColor, name1, font_mini+1, font_in_use, 1);
            write_text (-y-rowsHeight/2, x-textWidth/2+width, lightColor, name2, font_mini, font_in_use, 1);
        }
    }
}


function drawMenu(x, y, width, height, togglesLeft, togglesRight, dontDrawTriangle)
{
    with (mgraphics) {
        set_source_rgba(grayColor);
        rectangle(x, y, width, height);
        fill();
        var indent = (height-5)/2;
        set_source_rgba(bgColor);
        //leave space for buttons
        var x_local = x;
        for (i=0; i<togglesLeft; i++) {
            x_local += (height+lineThickness/2);
            move_to (x_local, y);
            rel_line_to(0, indent);
            move_to(x_local, y+height);
            rel_line_to(0, -indent);
            stroke();
            x_local = Math.ceil(x_local);
        }
        for (i=0; i<togglesRight; i++) {
            width -= (height+lineThickness/2);
            move_to (x+width, y);
            rel_line_to(0, indent);
            move_to(x+width, y+height);
            rel_line_to(0, -indent);
            stroke();
            width = Math.floor(width);
        }
        //draw triangle
        if(!dontDrawTriangle) {
            move_to (x+width-thisOffset[0]-menuTriangle[0], y+height/2-menuTriangle[1]/2);
            rel_line_to(menuTriangle[0], 0);
            rel_line_to(-menuTriangle[0]/2, menuTriangle[1]);
            close_path();
            fill();
        }
    }
}

function draw_grid (posX, posY, offsetBetweenLineX, offsetBetweenLineY,  columns, rows, xSquareDim, ySquareDim, kindOfColor, activeStep, squareThickness, colorOff, colorOn)
{
    with (mgraphics) {
        set_line_width(squareThickness);
        var myCounter = 0;
        
        for (i=0; i<rows; i++) {
            for (y=0; y<columns; y++) {
                rectangle (posX+y*(offsetBetweenLineX+xSquareDim)+squareThickness/2, posY+i*(offsetBetweenLineY+ySquareDim)+squareThickness/2, xSquareDim-squareThickness, ySquareDim-squareThickness);
                if (!kindOfColor[myCounter]) {
                    set_source_rgba(colorOff);
                } else {
                    set_source_rgba (colorOn);
                }
                if (myCounter==activeStep) {
                    stroke_preserve();
                    fill();
                } else {
                    stroke();
                }
                myCounter += 1;
            }
        }
    }
}

function drawTimeResBox (color, backgroundColor, x, y, w, hasSync, hasSwing) //hasSwing parameter if greater than 0 is equal to swing length in px
{
    with (mgraphics) {
        set_source_rgba(color);
        if (hasSync) {
            rectangle(x, y, rowsHeight, rowsHeight);
            fill();
            x += (rowsHeight+lineThickness);
            w -= (rowsHeight+lineThickness);
        }
        var swingLength = hasSwing;
        if (hasSwing) {
            swingLength = hasSwing+lineThickness;
        }
        var firstPartWidth = w-((rowsHeight+lineThickness)*3)-swingLength ;
        
        rectangle (x, y, firstPartWidth, rowsHeight);
        fill();
        //draw mode thing
        drawTab (x+firstPartWidth+lineThickness, y, 3, [rowsHeight, rowsHeight, rowsHeight], -1);
        //draw swing thing
        if (hasSwing) {
            rectangle (x+w-hasSwing+lineThickness/2, y+lineThickness/2, hasSwing-lineThickness, rowsHeight-lineThickness);
            stroke();
        }
        var dotDiameter = 4;
        set_source_rgba(backgroundColor);
        ellipse(x+firstPartWidth+lineThickness/2-dotDiameter/2, y+rowsHeight/2-dotDiameter/2, dotDiameter, dotDiameter);
        fill();
        var lineResDim = 8;
        move_to(x+firstPartWidth/2+lineResDim/2, y);
        rel_line_to(-lineResDim, rowsHeight);
        stroke();

    }
}

function drawRectWithTriangleOnSide (direction, x, y, w, color, localText, hasButton, isVertical, activateButton)
{
    //direction 0 = left
    //direction 1 = right
    var localHeight = rowsHeight;
    var localWidth = w;
    if (isVertical) {
        localHeight = w;
        localWidth = titlesHeight+triangleDim[1];
        x -= triangleDim[1];
    }
    
    var centerTextPosition = y+localHeight/2;
    
    with (mgraphics) {
        set_source_rgba(color);
        var newW = localWidth-triangleDim[1];
        var xForText;
        if (!direction) {
            rectangle_rounded(x+triangleDim[1], y, newW, localHeight, 4.5, 4.5);
            fill();
            rectangle(x+localWidth, y, -newW/2, localHeight);
            fill();
            move_to(x, centerTextPosition);
            rel_line_to(triangleDim[1], -triangleDim[0]/2);
            rel_line_to(0, triangleDim[0]);
            close_path();
            fill();
            xForText = x+triangleDim[1]+newW/2;
        } else {
            rectangle_rounded(x, y, newW, localHeight, 4.5, 4.5);
            fill();
            rectangle(x, y, newW/2, localHeight);
            fill();
            move_to(x+localWidth, centerTextPosition);
            rel_line_to(-triangleDim[1], -triangleDim[0]/2);
            rel_line_to(0, triangleDim[0]);
            close_path();
            fill();
            xForText = x+newW/2;
        }
        if (hasButton) {
            if(!direction) {
                drawButtonInRectWithTriangle (x+localWidth-localHeight, y, activateButton);
            } else {
                drawButtonInRectWithTriangle (x, y, activateButton);
            }
            xForText -=(localHeight/2-localHeight*direction-lineThickness/2+lineThickness*direction);
        }
        if (isVertical) {
            var temp = xForText;
            xForText = -centerTextPosition;
            centerTextPosition = temp;
        }
        write_text (xForText, centerTextPosition, lightColor, localText, font_size, font_in_use, isVertical);
    }
}

function drawButtonInRectWithTriangle (dimX, dimY, colorVariable)
{
    with (mgraphics) {
        //draw button
        set_source_rgba(bgColor);
        ellipse(dimX+lineThickness, dimY+lineThickness, rowsHeight-lineThickness*2, rowsHeight-lineThickness*2);
        fill();
        if (colorVariable) {
            set_source_rgba(mainColor);
        } else {
            set_source_rgba(grayColor);
        }
        ellipse(dimX+lineThickness*2, dimY+lineThickness*2, rowsHeight-lineThickness*4, rowsHeight-lineThickness*4);
        fill();
    }
}

function drawRectWithTriangle (x, y, w, color, localText, direction, optionalHeight)
{
    with (mgraphics) {
        if (!optionalHeight) {
            optionalHeight = titlesHeight;
        }
        set_source_rgba(color);
        rectangle_rounded(x, y, w, optionalHeight, 4.5, 4.5);
        fill();
        if (!direction) {
            rectangle(x, y, w, optionalHeight/2);
            fill();
            move_to(x+w/2, y+optionalHeight+triangleDim[1]);
            rel_line_to(triangleDim[0]/2, -triangleDim[1]);
            rel_line_to(-triangleDim[0], 0);
            close_path();
            fill();
        } else {
            rectangle(x, y+optionalHeight/2, w, optionalHeight/2);
            fill();
            move_to(x+w/2, y-triangleDim[1]);
            rel_line_to(triangleDim[0]/2, triangleDim[1]);
            rel_line_to(-triangleDim[0], 0);
            close_path();
            fill();
        }
        write_text (x+w/2, y+optionalHeight/2, lightColor, localText, font_size, font_in_use);
    }
}

function write_text (dimX, dimY, textColor, writtenText, functionFontSize, functionFont, verticalStatus)
{
    with (mgraphics) {
        if (verticalStatus) {
            rotate (-Math.PI/2);
        }
        set_font_size(functionFontSize);
        select_font_face(functionFont);
        var textDim = text_measure(writtenText);
        //if (textDim == null) { continue; }
        move_to(dimX-textDim[0]/2,dimY+textDim[1]/3);
        text_path(writtenText);
        set_source_rgba(textColor);
        fill();
        if (verticalStatus) {
            identity_matrix();
        }
    }
}

function drawRectToggle (x, y, w, color, colortext, localText)
{
    with (mgraphics) {
        set_source_rgba(color);
        rectangle(x, y, w, rowsHeight);
        fill();
        write_text (x+w/2, y+rowsHeight/2, colortext, localText, font_toggles, font_in_use);
    }
}

function letterBox (name, x, y, color)
{
    with (mgraphics) {
        set_source_rgba(color);
        rectangle(x+lineThickness*1.5, y+lineThickness*1.5, rowsHeight-3*lineThickness, rowsHeight-3*lineThickness);
        stroke();
        var dimensionText = text_measure(name);
        move_to(x+rowsHeight/2-dimensionText[0]/2, y+rowsHeight/2+dimensionText[1]/3);
        text_path (name);
        fill();
    }
}

function drawTab (x, y, quantity, arrayOfWidths, pageSelected)
{
    with (mgraphics) {
        set_source_rgba(grayColor);
        var thisX = x;
        for (i=0; i<arrayOfWidths.length; i++) {
            var localHeight = rowsHeight;
            if (pageSelected==i) {
                localHeight = rowsHeight+1;
            }
            rectangle(thisX, y, arrayOfWidths[i], localHeight);
            fill();
            thisX += arrayOfWidths[i];
            
            if (i+1==arrayOfWidths.length) {
                break;
            }
            
            
            rectangle(thisX, y+1, 1, rowsHeight-2);
            fill();
            thisX += 1;
        }
    }
}





