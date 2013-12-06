Main = 
  blocks: [[],[],[],[],[],[],[],[]]
  queens: []
  guides: []
  guideEnabled: false
  count: 0
  time: 0
  timer: null
  result: false
  queenImageUsed: [false, false, false, false, false, false, false, false]
  nyahSound: null
  clickSound: null

$ ->
  playBGM()
  replaceScene('intro')
  #ブロック要素を二次元配列に格納
  blocks = $('.block')
  for i in [0...8]
    for j in [0...8]
      block = blocks[i*8+j]
      block.x = i
      block.y = j
      block.status = 0
      block.onclick = ->
        toggle(this)
      Main.blocks[i].push(block)
  updateCountLabel()
  $('#startbutton').click ->
    playSound('../sound/start.wav')
    replaceScene('main')
    Main.time = 0
    startTimer()
    updateTimeLabel()
  $('#judgebutton').click ->
    if !$('#judgebutton').hasClass('disabled')
      showResult()

  $('#resetbutton').click ->
    playSound('../sound/reset.wav')
    reset()

  $('#backbutton').click ->
    playClick()
    $('#message').hide()

  $('#guidebutton').click ->
    playClick()
    switchGuide()

  $('#titlebutton').click ->
    playClick()
    reset()
    Main.guideEnabled = true
    switchGuide()
    replaceScene('intro')

replaceScene = (id) ->
  scenes = ['intro', 'main', 'message']
  for s, i in scenes
    $('#'+s).hide()
  $('#'+id).show()

toggle = (block) ->
  if block.status
    $(block).removeClass('active')
    console.log 'cat'+block.image
    $(block).removeClass('cat'+block.image)
    Main.queenImageUsed[block.image] = false
    block.status = 0
    Main.count--
    removeElem(Main.queens, [block.x, block.y])
  else if Main.count<8
    playNyah()
    imageNum = pickQueenImageNumber()
    $(block).addClass('active')
    $(block).addClass('cat'+imageNum)
    block.status = 1
    block.image = imageNum
    Main.count++
    Main.queens.push([block.x, block.y])
  if Main.guideEnabled
    refreshGuide()
  updateCountLabel()
  updateJudgeButtonState()

updateJudgeButtonState = ->
  if Main.count==8
    $('#judgebutton').removeClass('disabled')
  else
    $('#judgebutton').addClass('disabled', 'disabled')

judge = ->
  queens = Main.queens
  #縦横
  for q, i in queens
    for j in [i+1...queens.length]
      if q[0]==queens[j][0] or q[1]==queens[j][1]
        return false
  #斜め
  for q, i in queens
    for j in [i+1...queens.length]
      if (queens[j][1] == -queens[j][0] + q[1]+q[0]) or (queens[j][1] == queens[j][0] + q[1]-q[0])
        return false
  return true

updateCountLabel = ->
  $('#countlabel').html('×' + Main.count + '/8')

updateTimeLabel = ->
  $('#timelabel').html(Main.time + '秒')
  Main.time++

startTimer = ->
  Main.time = 0
  if Main.timer
    clearInterval(Main.timer)
  Main.timer = setInterval(updateTimeLabel, 1000)

reset = ->
  Main.count = 0
  updateCountLabel()
  for i in [0...8]
    Main.queenImageUsed[i] = false
    for j in [0...8]
      block = Main.blocks[i][j]
      block.status = 0
      $(block).removeClass('active')
      $(block).removeClass('mark')
      $(block).removeClass (index, css) ->
        (css.match(/cat\d/g) || []).join(' ')
  Main.queens = []
  for g, i in Main.guides
    g.remove()
  Main.guides = []
  updateJudgeButtonState()
  console.log Main.queens

showMessage = (mes) ->
  $('.messagelabel').html(mes)
  $('#message').show()

showResult = ->
  if !$(this).hasClass('disabled')
    if judge()
      playSound('../sound/correct.wav')
      clearInterval(Main.timer)
      showMessage("正解！<br><br>タイム: "+(Main.time-1)+"秒")
      Main.result = true
    else
      playSound('../sound/wrong.wav')
      showMessage("不正解")
      Main.result = false

switchGuide = ->
  if Main.guideEnabled
    $('#guidebutton').removeClass('active')
    $('#guidebutton').html('ガイドON')
    clearGuide()
  else
    $('#guidebutton').addClass('active')
    $('#guidebutton').html('ガイドOFF')
    refreshGuide()

  Main.guideEnabled = !Main.guideEnabled

refreshGuide = ->
  clearGuide()
  queens = Main.queens
  for q, i in queens
    for x in [0...8]
      #縦横
      if x!=q[1]
        guide = $('<div>').addClass('guide')
        guide.x = q[0]
        guide.y = x
        block = $(Main.blocks[q[0]][x])
        block.append(guide)
        if block.hasClass('active')
          mark = $('<div>').addClass('mark')
          $(guide).append(mark)
        Main.guides.push(guide)
      if x!=q[0]
        guide = $('<div>').addClass('guide')
        guide.x = x
        guide.y = q[1]
        block = $(Main.blocks[x][q[1]])
        block.append(guide)
        if block.hasClass('active')
          mark = $('<div>').addClass('mark')
          $(guide).append(mark)
        Main.guides.push(guide)
      #斜め
      if x!=q[0]
        y = -x + q[1]+q[0]
        if 0<=y<8
          guide = $('<div>').addClass('guide')
          guide.x = x
          guide.y = y
          block = $(Main.blocks[x][y])
          block.append(guide)
          if block.hasClass('active')
            mark = $('<div>').addClass('mark')
            $(guide).append(mark)
          Main.guides.push(guide)

        y = x + q[1]-q[0]
        if 0<=y<8
          guide = $('<div>').addClass('guide')
          guide.x = x
          guide.y = y
          block = $(Main.blocks[x][y])
          block.append(guide)
          if block.hasClass('active')
            mark = $('<div>').addClass('mark')
            $(guide).append(mark)
          Main.guides.push(guide)

clearGuide = ->
  for g, i in Main.guides
    $(Main.blocks[g.x][g.y]).removeClass('mark')
    g.remove()
  Main.guides = []

pickQueenImageNumber = ->
  for b, i in Main.queenImageUsed
    if !b
      Main.queenImageUsed[i] = true
      return i

playBGM = ->
  bgm = new Audio('../sound/bgm.wav')
  bgm.loop = true
  bgm.play()

playNyah = ->
  if !Main.nyahSound
    Main.nyahSound = new Audio('../sound/cat.wav')
  else
    Main.nyahSound.currentTime = 0
  Main.nyahSound.play();

playClick = ->
  if !Main.clickSound
    Main.clickSound = new Audio('../sound/click.wav')
  else
    Main.clickSound.currentTime = 0
  Main.clickSound.play();

playSound = (path) ->
  sound = new Audio(path)
  sound.play()

#Foundation
removeElem = (array, value) ->
  removeIndexes = []
  for elem, i in array
    if elem.isEqualToArray(value)
      removeIndexes.push(i)
  for val, i in removeIndexes
    array = array.splice(val-i, 1)

Array.prototype.isEqualToArray = (array) ->
  return arraysEqual(this, array)

arraysEqual = (arrayA, arrayB) ->
  if arrayA.length != arrayB.length
    return false
  for v, i in arrayA
    a = arrayA[i]
    b = arrayB[i]
    console.log a+','+b
    if (a instanceof Array) and (b instanceof Array)
      if !arraysEqual(a, b)
        return false
    else
      if a!=b
        return false 
  return true


