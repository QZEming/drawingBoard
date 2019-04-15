let canvas = document.getElementById('canvas')
let context = canvas.getContext('2d')
canvas.width = 600
canvas.height = 450
window.onload = function() {
    let restore = [context.getImageData(0, 0, 600, 450)]
    let repeat = []
    shapeSelect()
    rangeChange()
    typeChange()
    document.getElementById('clear').onclick = () => {
        context.clearRect(0, 0, 600, 450)
        restore[restore.length] = context.getImageData(0, 0, 600, 450)
    }

    //改变填充颜色
    document.getElementById('fillColor').onchange = function() {
        document.getElementsByClassName('colorSet')[0].style.backgroundColor = this.value
    }

    //改变描边颜色
    document.getElementById('strokeColor').onchange = function() {
        document.getElementsByClassName('colorSet')[1].style.backgroundColor = this.value
    }

    //绘制
    canvas.onmousedown = function(event) {
        draw(event, canvas)
            // 重置恢复数组
        repeat.length = 0
        this.onmousemove = function(event) {
            draw(event, canvas)
        }

        this.onmouseup = function() {
            this.onmousemove = null
            restore[restore.length] = context.getImageData(0, 0, 600, 450)
        }
    }

    //撤回
    document.getElementById('reBack').onclick = function() {
            if (restore.length > 1) {
                repeat[repeat.length] = restore[restore.length - 1]
                context.putImageData(restore[restore.length - 2], 0, 0)
                restore.length--;
            }
        }
        //重复
    document.getElementById('repeat').onclick = function() {
            if (repeat.length > 0) {
                context.putImageData(repeat[repeat.length - 1], 0, 0)
                restore[restore.length] = repeat[repeat.length - 1]
                repeat.length--
            }
        }
        // 保存
    document.getElementById('save').onclick = function() {
        restoreImg()
    }


    function restoreImg() {
        let name = prompt('请输入要保存的图片名称', 'canvas绘制图片')
        if (name === "") {
            alert('名字不能为空')
        } else {
            let href = canvas.toDataURL()
            let a = document.createElement('a')
            a.download = name
            a.href = href
            a.dispatchEvent(new MouseEvent('click'))
        }
    }

    document.onkeydown = function(e) {
        var keyCode = e.keyCode || e.which || e.charCode;
        var ctrlKey = e.ctrlKey || e.metaKey;
        //绑定点击事件对象
        let clickEvent = new MouseEvent('click')
        if (ctrlKey && keyCode == 90) {
            document.getElementById('reBack').dispatchEvent(clickEvent)
        } else if (ctrlKey && keyCode == 89) {
            document.getElementById('repeat').dispatchEvent(clickEvent)
        } else if (ctrlKey && keyCode == 83) {
            document.getElementById('save').dispatchEvent(clickEvent)
        }
        e.preventDefault();
        return false;
    }


}


function shapeSelect() {
    let flag = true
    let shape = document.getElementById('shape')
    shape.onclick = function() {
        if (flag) {
            for (let i = 0; i < shape.getElementsByTagName('li').length; i++) {
                shape.getElementsByTagName('li')[i].style.display = 'inline'
            }
        } else {
            for (let i = 0; i < shape.getElementsByTagName('li').length; i++) {
                shape.getElementsByTagName('li')[i].style.display = 'none'
            }
        }
        flag = !flag
    }
    for (let i = 0; i < shape.getElementsByTagName('li').length; i++) {
        shape.getElementsByTagName('li')[i].onclick = function() {
            shape.setAttribute('value', this.getAttribute('value'))
            shape.setAttribute('class', this.className)
        }
    }
}

function rangeChange() {
    let number = document.getElementById('number')
    let range = document.getElementById('range')
    number.onchange = function() {
        if (number.value < 0)
            number.value = 0
        else if (number.value > 100)
            number.value = 100
        range.value = number.value
    }
    range.onmousemove = function() {
        number.value = range.value
    }
}

function typeChange() {
    let type = document.getElementById('type')
    type.onclick = function() {
        if (type.getAttribute('value') == 'fill') {
            type.setAttribute('value', 'stroke')
            type.getElementsByTagName('span')[0].innerHTML = '描边'
        } else {
            type.setAttribute('value', 'fill')
            type.getElementsByTagName('span')[0].innerHTML = '填充'
        }
    }
}

function draw(event, cavas) {
    let left = event.clientX - cavas.offsetLeft
    let top = event.clientY - cavas.offsetTop
    let radius = document.getElementById('number').value // 设置画笔半径
    let type = document.getElementById('type').getAttribute('value') // 设置画笔类型
    context.fillStyle = document.getElementById('fillColor').value // 设置填充颜色
    context.strokeStyle = document.getElementById('strokeColor').value // 设置描边颜色
    switch (document.getElementById('shape').getAttribute('value')) {
        case "arc":
            drawByArc(left, top, radius, type)
            break
        case "ric":
            drawByRic(left, top, radius, type)
            break
        case "tri":
            drawByTriangle(left, top, radius, type)
            break
        case "hexagon":
            drawByHexagon(left, top, radius, type)
            break
        case "pentagram":
            drawByPentagram(left, top, radius, type)
            break
    }
}


//画笔方法
//圆形
function drawByArc(x, y, radius, type) {
    context.beginPath()
    context.arc(x, y, radius, 0, 2 * Math.PI)

    if (type == 'fill') {

        context.fill()
    } else
        context.stroke()
    context.closePath()
}
//正方形
function drawByRic(x, y, radius, type) {
    radius *= 2
    context.beginPath()
    context.rect(x - radius / 2, y - radius / 2, radius, radius)
    if (type == 'fill')
        context.fill()
    else
        context.stroke()
    context.closePath()
}
//正三角形
function drawByTriangle(x, y, radius, type) {
    context.beginPath()
    context.moveTo(x, y - radius)
    context.lineTo(x + Math.sin(Math.PI / 3) * radius, y + Math.cos(Math.PI / 3) * radius)
    context.lineTo(x - Math.sin(Math.PI / 3) * radius, y + Math.cos(Math.PI / 3) * radius)
    context.lineTo(x, y - radius)
    if (type == 'fill')
        context.fill()
    else
        context.stroke()
    context.closePath()
}

//正六边形
function drawByHexagon(x, y, radius, type) {
    radius = parseInt(radius)
    let offsetX = radius * Math.sin(Math.PI / 6)
    let offsetY = radius * Math.cos(Math.PI / 6)
    context.beginPath()
    context.moveTo(x - offsetX, y - offsetY)
    context.lineTo(x + offsetX, y - offsetY)
    context.lineTo(x + radius, y)
    context.lineTo(x + offsetX, y + offsetY)
    context.lineTo(x - offsetX, y + offsetY)
    context.lineTo(x - radius, y)
    context.lineTo(x - offsetX, y - offsetY)
    if (type == 'fill')
        context.fill()
    else
        context.stroke()
    context.closePath()
}

//五角星
function drawByPentagram(x, y, radius, type) {
    radius = parseInt(radius)
    inRadius = radius / 2
    let perAngle = 2 * Math.PI / 5
    context.beginPath()
    for (let i = 0; i <= 5; i++) {
        context.lineTo(x + Math.sin(i * perAngle) * radius, y - Math.cos(i * perAngle) * radius)
        context.lineTo(x + Math.sin(i * perAngle + perAngle / 2) * inRadius, y - Math.cos(i * perAngle + perAngle / 2) * inRadius)
    }
    if (type == 'fill')
        context.fill()
    else
        context.stroke()
    context.closePath
}