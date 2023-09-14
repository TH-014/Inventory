import * as React from 'react';
import axios from "axios";
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import AcceptIcon from '@mui/icons-material/CheckCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function createData(TEMP_O_ID, C_ID, PLACE_DATE, SHIPPING_ADDRESS, BKASH_MOB_NO,BKASH_TRANS_ID,TOTAL_EXPENSE,E_ID) {
	return {
		TEMP_O_ID,
		C_ID,
		PLACE_DATE,
		SHIPPING_ADDRESS,
		BKASH_MOB_NO,
		BKASH_TRANS_ID,
		TOTAL_EXPENSE,
		E_ID
	};
}


let rows = [];
let selectedArray = [];

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}




const headCells = [
	{
		id: 'TEMP_O_ID',
		numeric: true,
		disablePadding: true,
		label: 'Order ID',
	},
	{
		id: 'C_ID',
		numeric: true,
		disablePadding: false,
		padding: 'center',
		label: 'Customer ID',
	},
	{
		id: 'PLACE_DATE',
		numeric: false,
		date: true,
		disablePadding: false,
		label: 'Place Date',
	},
	{
		id: 'SHIPPING_ADDRESS',
		numeric: false,
		text: true,
		padding: 'right',
		disablePadding: false,
		label: 'Shipping Address',
	},
	{
		id: 'BKASH_MOB_NO',
		numeric: true,
		disablePadding: false,
		label: 'Bkash Mobile No',
	},
	{
		id: 'BKASH_TRANS_ID',
		numeric: true,
		disablePadding: false,
		label: 'Bkash Transaction ID',
	},
	{
		id: 'TOTAL_EXPENSE',
		numeric: true,
		disablePadding: false,
		label: 'Total Expense',
	}

];





function EnhancedTableHead(props) {
	const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
		props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						color="primary"
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{
							'aria-label': 'select all desserts',
						}}
					/>
				</TableCell>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						// align={headCell.numeric ? 'right' : 'left'}
						align = 'center'
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf(['asc', 'desc']).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
};


function EnhancedTableToolbar(props) {
	const { numSelected } = props;

	const navigate = useNavigate();

	const onAcceptButtonClick = async (e) =>{

		e.preventDefault();
		console.log('Inside onAcceptButtonClick');
		console.log('selectedArray = ',selectedArray);
		try{
			const resFromServer = await axios.post('http://localhost:8000/acceptOrder', {
				selectedArray
			});
			console.log(resFromServer);
			if(resFromServer.status === 200){
				for(let i = 0; i < selectedArray.length; i++){
					for(let j = 0; j < rows.length; j++){
						if(selectedArray[i] === rows[j].TEMP_O_ID){
							rows.splice(j,1);
						}
					}
				}

				console.log('Order accepted.');
				//navigate('/');
				navigate('/ProfileOfEmployee');

				//window.location.reload();
			}
		}catch(error)
		{
			console.log(error);
		}
	}

	const onDeleteButtonClick = async (e) =>{

		e.preventDefault();

		console.log('Inside onDeleteButtonClick');
		console.log('selectedArray = ',selectedArray);
		try{
			const resFromServer = await axios.post('http://localhost:8000/deleteOrder', {
				selectedArray
			});
			console.log(resFromServer);
			if(resFromServer.status === 200){
				for(let i = 0; i < selectedArray.length; i++){
					for(let j = 0; j < rows.length; j++){
						if(selectedArray[i] === rows[j].TEMP_O_ID){
							rows.splice(j,1);
						}
					}
				}

				console.log('Order deleted.');
				// window.location.reload();
			}
			navigate('/ProfileOfEmployee');

		}catch(error)
		{
			console.log(error);
		}

	}

	return (
		<Toolbar
			sx={{
				pl: { sm: 2 },
				pr: { xs: 1, sm: 1 },
				...(numSelected > 0 && {
					bgcolor: (theme) =>
						alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
				}),
			}}
		>
			{numSelected > 0 ? (
				<Typography
					sx={{ flex: '1 1 100%' }}
					color="inherit"
					variant="subtitle1"
					component="div"
				>
					{numSelected} selected
				</Typography>
			) : (
				<Typography
					sx={{ flex: '1 1 100%' }}
					variant="h6"
					id="tableTitle"
					component="div"
				>
					Pendings..
				</Typography>
			)}

			{numSelected > 0 ? (
				<Tooltip title="">
					<Tooltip title="Accept">
						<IconButton>
							<AcceptIcon onClick ={onAcceptButtonClick}/>

						</IconButton>
					</Tooltip>
					<Tooltip title="Delete">
						<IconButton>
							<DeleteIcon onClick ={onDeleteButtonClick}/>

						</IconButton>
					</Tooltip>
				</Tooltip>
			) : null}
		</Toolbar>
	);
}

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired,
};
let flag = false;

export default function EnhancedTable() {

	const location = useLocation();
	const orderData = location.state && location.state.orderData; // Check for undefined
//const date = orderData[0][2].split("T");
//console.log(date[0]);


	console.log(orderData)
	if(flag === false){
		for(let i = 0; i < orderData.length; i++){
			const date = orderData[i][2].split("T");

			rows.push(createData(orderData[i][0],orderData[i][1],date[0],orderData[i][3],orderData[i][4],orderData[i][5],orderData[i][6],orderData[i][7]));
		}
		flag = true;
	}
	console.log("here",orderData[0]);

	//rows.push(orderData.map((row) => (

	const [order, setOrder] = React.useState('asc');
	const [orderBy, setOrderBy] = React.useState('calories');
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [dense, setDense] = React.useState(false);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
//   let selectedArray = [];

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};




	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = rows.map((n) => n.TEMP_O_ID);
			setSelected(newSelected);
			selectedArray = newSelected;
			return;
		}
		setSelected([]);
	};




	const handleClick = (event, TEMP_O_ID) => {
		const selectedIndex = selected.indexOf(TEMP_O_ID);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, TEMP_O_ID);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}
		console.log('Inside Selected 1',selected);
		setSelected(newSelected);
		selectedArray = newSelected;
		console.log('Inside Selected 2',selectedArray);
		console.log('Inside Selected 2',selected);

	};



	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleChangeDense = (event) => {
		setDense(event.target.checked);
	};

	const isSelected = (TEMP_O_ID) => selected.indexOf(TEMP_O_ID) !== -1;

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

	const visibleRows = React.useMemo(
		() =>
			stableSort(rows, getComparator(order, orderBy)).slice(
				page * rowsPerPage,
				page * rowsPerPage + rowsPerPage,
			),
		[order, orderBy, page, rowsPerPage],
	);



	return (
		<Box sx={{ width: '100%' }} style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
			<Paper sx={{ width: '100%', mb: 2 }}>
				<EnhancedTableToolbar numSelected={selected.length} />
				<TableContainer>
					<Table
						sx={{ minWidth: 750 }}
						aria-labelledby="tableTitle"
						size={dense ? 'small' : 'medium'}
					>
						<EnhancedTableHead
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={rows.length}
						/>
						<TableBody>
							{visibleRows.map((row, index) => {
								const isItemSelected = isSelected(row.TEMP_O_ID);
								const labelId = `enhanced-table-checkbox-${index}`;

								return (
									<TableRow
										hover
										onClick={(event) => handleClick(event, row.TEMP_O_ID)}
										role="checkbox"
										aria-checked={isItemSelected}
										tabIndex={-1}
										key={row.TEMP_O_ID}
										selected={isItemSelected}
										sx={{ cursor: 'pointer' }}
									>
										<TableCell padding="checkbox">
											<Checkbox
												color="primary"
												checked={isItemSelected}
												inputProps={{
													'aria-labelledby': labelId,
												}}

											/>
										</TableCell>
										<TableCell
											component="th"
											id={labelId}
											scope="row"
											padding="right"
										>
											{row.TEMP_O_ID}
										</TableCell>
										<TableCell align="center">{row.C_ID}</TableCell>
										<TableCell align="center">{row.PLACE_DATE}</TableCell>
										<TableCell align="center">{row.SHIPPING_ADDRESS}</TableCell>
										<TableCell align="center">{row.BKASH_MOB_NO}</TableCell>
										<TableCell align="center">{row.BKASH_TRANS_ID}</TableCell>
										<TableCell align="center">{row.TOTAL_EXPENSE}</TableCell>

									</TableRow>
								);
							})}
							{emptyRows > 0 && (
								<TableRow
									style={{
										height: (dense ? 33 : 53) * emptyRows,
									}}
								>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
			<FormControlLabel
				control={<Switch checked={dense} onChange={handleChangeDense} />}
				label="Dense padding"
			/>
		</Box>
	);
}