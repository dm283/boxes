function display_2d_row(mesh, storage_row) {
  //
  // console.log('len=', storage_row.length, storage_row)
  const rows = 1;
  const levels = storage_row.length;
  const place_levels = 1; 
  const place_level_places = [];
  place_level_places[0] = storage_row[0].length;
  // place_level_places[1] = 4;
  td_color = [];
  td_color[0] = 'green';
  td_color[1] = 'yellow';
  td_color[2] = 'red';
  td_color[3] = 'blue';

  var th_rowspan_row = place_levels+1;
  var th_colspan_place = 1
  for (let i=0; i<place_levels; i++) {
    th_colspan_place *= place_level_places[i]
  }

  const cell_matrix1 = []
  // cell_matrix1[0] = JSON.parse(JSON.stringify(storage_row));
  // console.log('storage_row=', storage_row[0][0])
  // console.log('cell_matrix1=', cell_matrix1[0][0][0])

  for (i=1; i<=rows; i++) {
      cell_matrix1[i] = []
    for (j=1; j<=levels; j++) {
      cell_matrix1[i][j] = []
      for (k=1; k<=th_colspan_place; k++) {
          cell_matrix1[i][j][k] = []
          cell_matrix1[i][j][k]['box_name'] = storage_row[j-1][k-1]['box_name']
          cell_matrix1[i][j][k]['order'] = storage_row[j-1][k-1]['order']
          cell_matrix1[i][j][k]['articul'] = storage_row[j-1][k-1]['articul']
          cell_matrix1[i][j][k]['quantity'] = storage_row[j-1][k-1]['quantity']
          cell_matrix1[i][j][k]['status'] = storage_row[j-1][k-1]['status']
      }
    }
  }

  var modal_2d_row = document.getElementById("modal_2d_row");
  modal_2d_row.style.display = "block";
  render_table(th_rowspan_row, th_colspan_place, place_levels, place_level_places, rows, levels, cell_matrix1);
}


function close_modal_2d_row() {
    modal_2d_row.style.display = "none";
}


function render_table(th_rowspan_row, th_colspan_place, place_levels, place_level_places, rows, levels, cell_matrix1) {
    //
  var thead = create_thead(place_levels, place_level_places);
  var tbody = create_tbody(rows, levels, th_colspan_place, cell_matrix1);
  var storage_matrix = `
  <div class="modal-2d-row-content"><span class="close" onclick="close_modal_2d_row()">&times;</span>
    <table>
      <thead>
        <tr>
          <th rowspan='${th_rowspan_row}'>ряд</th>
          <th rowspan='${th_rowspan_row}'>ярус</th>
          <th colspan='${th_colspan_place}'>место</th>
        </tr>
        ${thead}
      </thead>

      <tbody>
        ${tbody}
      </tbody>
    </table>
  </div>
  `
  //var storage_matrix = `<div class="modal-2d-row-content"><span class="close" onclick="close_modal_2d_row()">&times;</span>THIS IS A WINDOW!!!!!!!</div>`

  document.getElementById("modal_2d_row").innerHTML = storage_matrix
}


function create_thead(place_levels, place_level_places) {
    //
    var thead = ''
    for (let i=0; i<place_levels; i++) {
      tr_content = render_thead_tr(i, place_level_places, place_levels);
      thead += ('<tr>' + tr_content + '</tr>');
    }

    return thead;
  }


function render_thead_tr(n, place_level_places, place_levels) {
    //
    var thead_tr = '';
    var perv_level_places = 0;
    if (n > 0) { perv_level_places = place_level_places[n-1] }
    else { perv_level_places = 1 }
    places = place_level_places[n] * perv_level_places
    if ( n < (place_levels-1) ) { colspan_str = ` colspan="${place_level_places[n+1]}"` }
    else { colspan_str = '' }
    for (let i=0; i<places; i++) { thead_tr += `<th${colspan_str}>${i+1}</th>` }

    return thead_tr
  }


function create_tbody(rows, levels, th_colspan_place, cell_matrix1) {
    //
    var tbody = ''
    const y = rows * levels
    for (let i=1; i<=rows; i++) {
      for (let j=levels; j>=1; j--) {
        line_content_sideheader = render_line_sideheader(i, j, levels)
        line_content_cells = render_line_cells(i, j, th_colspan_place, cell_matrix1)
        line_content = line_content_sideheader + line_content_cells
        tbody += ('<tr>' + line_content + '</tr>');
      }
    }
    
    return tbody
}


function render_line_sideheader(row, level, levels) {
    rowsideheader_str = ''
    if (level == levels) {
      rowsideheader_str = `<td rowspan="${levels}"><b>${row}</b></td>`
    }
    line_content_sideheader = `${rowsideheader_str}<td><b>${level}</b></td>`
    return line_content_sideheader
}


function render_line_cells(row, level, th_colspan_place, cell_matrix1) {
    //
    line_content_cells = ''
    for (let i=1; i<=th_colspan_place; i++) {
      line_content_cells += `<td 
      onclick='cell_click(${row}, ${level}, ${i})'
      bgcolor=${td_color[cell_matrix1[row][level][i]['status']]}
      >
        ${cell_matrix1[row][level][i]['box_name']}<br>
        ${cell_matrix1[row][level][i]['order']}<br>
        ${cell_matrix1[row][level][i]['articul']}<br>
        ${cell_matrix1[row][level][i]['quantity']}&nbsp;шт.<br>
        </td>`
    }
    return line_content_cells
}


