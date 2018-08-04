var classes = []

async function prepModel() {
    //load the model
    model = await tf.loadModel('model/model.json')
    console.log('model loaded!')
    //warm up
    model.predict(tf.zeros([1, 28, 28, 1]))
    return model
}

function preprocess()
{
return tf.tidy(()=>{
    //convert the image data to a tensor
    let tensor = tf.fromPixels(drawingArea.getImage(), numChannels= 1)
    //resize to 28 x 28
    const resized = tf.image.resizeBilinear(tensor, [28, 28]).toFloat()
    // Normalize the image
    const div = tf.scalar(255.0);
    const normalized = resized.sub(div).abs().div(div)
    //We add a dimension to get a batch shape
    const batched = normalized.expandDims(0)
    return batched
})
}

async function loadDict() {
    loc = 'categories.txt'
    await $.ajax({
        url: loc,
        dataType: 'text',
    }).done(success);
}
function success(data) {
    const lst = data.split(/\n/)
    console.log(data)
    for (var i = 0; i < lst.length - 1; i++) {
        let symbol = lst[i]
        classes.push(symbol)
    }
}
function getClassNames(indices) {
    var outp = []
    for (var i = 0; i < indices.length; i++)
        outp[i] = classes[indices[i]]
    return outp
}
function findIndicesOfMax(inp, count) {
    var outp = [];
    for (var i = 0; i < inp.length; i++) {
        outp.push(i); // add index to output array
        if (outp.length > count) {
            outp.sort(function(a, b) {
                return inp[b] - inp[a];
            }); // descending sort the output array
            outp.pop(); // remove the last index (index of smallest element in output array)
        }
    }
    return outp;
}
function findTopValues(inp, count) {
    var outp = [];
    let indices = findIndicesOfMax(inp, count)
    // show 5 greatest scores
    for (var i = 0; i < indices.length; i++)
        outp[i] = inp[indices[i]]
    return outp
}
function updatePie() {
  if (xHist.length > 2) {
    const pred = model.predict(preprocess()).dataSync()

    const indices = findIndicesOfMax(pred, 5)
    const probs = findTopValues(pred, 5)
    const names = getClassNames(indices)

    document.getElementById('p1').innerHTML = names[0]
    document.getElementById('p2').innerHTML = names[1]
    document.getElementById('p3').innerHTML = names[2]
    document.getElementById('p4').innerHTML = names[3]
    document.getElementById('p5').innerHTML = names[4]
    new_percents = probs
  }
}
