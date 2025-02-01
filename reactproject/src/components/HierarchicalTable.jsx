import React, { useState } from 'react';
import './HierarchicalTable.css';

const calculateTotalValue = (rows) => {
  return rows.map(row => {
    if (row.children) {
      row.value = row.children.reduce((total, child) => total + child.value, 0);
    }
    return row;
  });
};

const calculateGrandTotal = (rows) => {
  return rows.reduce((total, row) => total + row.value, 0);
};

const distributeValueToChildren = (row, value) => {
  if (row.children) {
    const totalChildrenValue = row.children.reduce((total, child) => total + child.value, 0);
    row.children = row.children.map(child => {
      child.value = (child.value / totalChildrenValue) * value;
      return child;
    });
  }
  return row;
};

const HierarchicalTable = ({ rows }) => {
  const [tableRows, setTableRows] = useState(calculateTotalValue(rows));
  const [originalRows] = useState(JSON.parse(JSON.stringify(rows))); // Deep copy of original rows

  const handlePercentageAllocation = (row, percentage) => {
    const updatedRows = tableRows.map(r => {
      if (r.id === row.id) {
        r.value += (r.value * percentage) / 100;
        distributeValueToChildren(r, r.value);
      }
      if (r.children) {
        r.children = r.children.map(child => {
          if (child.id === row.id) {
            child.value += (child.value * percentage) / 100;
          }
          return child;
        });
      }
      return r;
    });
    setTableRows(calculateTotalValue(updatedRows));
  };

  const handleValueAllocation = (row, value) => {
    const updatedRows = tableRows.map(r => {
      if (r.id === row.id) {
        r.value = value;
        distributeValueToChildren(r, value);
      }
      if (r.children) {
        r.children = r.children.map(child => {
          if (child.id === row.id) {
            child.value = value;
          }
          return child;
        });
      }
      return r;
    });
    setTableRows(calculateTotalValue(updatedRows));
  };

  const calculateVariance = (row) => {
    const originalRow = originalRows.find(r => r.id === row.id) || {};
    const originalValue = originalRow.value || 0;
    return originalValue ? ((row.value - originalValue) / originalValue * 100).toFixed(2) : '0.00';
  };

  const grandTotal = calculateGrandTotal(tableRows);

  return (
    <div className='table-container'>
      <table>
        <thead>
          <tr>
            <th>Label</th>
            <th>Value</th>
            <th>Input</th>
            <th>Allocation %</th>
            <th>Allocation Val</th>
            <th>Variance %</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map(row => (
            <React.Fragment key={row.id}>
              <tr>
                <td>{row.label}</td>
                <td>{row.value.toFixed(2)}</td>
                <td><input type="number" id={`input-${row.id}`} /></td>
                <td><button onClick={() => handlePercentageAllocation(row, parseFloat(document.getElementById(`input-${row.id}`).value))}>Button1</button></td>
                <td><button onClick={() => handleValueAllocation(row, parseFloat(document.getElementById(`input-${row.id}`).value))}>Button2</button></td>
                <td>{calculateVariance(row)}%</td>
              </tr>
              {row.children && row.children.map(child => (
                <tr key={child.id}>
                  <td style={{ paddingLeft: '20px' }}>-- {child.label}</td>
                  <td>{child.value.toFixed(2)}</td>
                  <td><input type="number" id={`input-${child.id}`} /></td>
                  <td><button onClick={() => handlePercentageAllocation(child, parseFloat(document.getElementById(`input-${child.id}`).value))}>Button1</button></td>
                  <td><button onClick={() => handleValueAllocation(child, parseFloat(document.getElementById(`input-${child.id}`).value))}>Button2</button></td>
                  <td>{calculateVariance(child)}%</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
          <tr className="grand-total">
            <td>Grand Total</td>
            <td>{grandTotal.toFixed(2)}</td>
            <td colSpan="4"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HierarchicalTable;