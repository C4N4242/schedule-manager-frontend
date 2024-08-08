<script>
	import { onMount } from 'svelte';
	let schedules = [];
	let newSchedule = { title: '', description: '', date: '', time: '' };
	let editingSchedule = null;
	let errorMessages = '';
  
	async function fetchSchedules() {
		try {
			const res = await fetch('/api/schedules');
			if (!res.ok) throw new Error('予定の取得に失敗しました');
			schedules = await res.json();
		} catch (err) {
			errorMessages = err.message;
		}
	}
  
	async function addOrUpdateSchedule() {
  		// API呼び出しによる追加または更新の処理
		errorMessages = '';
		try {
			let res;
			if (editingSchedule) {
				res = await fetch(`/api/schedules/${editingSchedule.id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newSchedule),
				});
			} else {
				res = await fetch('/api/schedules', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newSchedule),
				});
			}
			if (!res.ok) throw new Error('予定の追加または更新に失敗しました');
			newSchedule = { title: '', description: '', date: '', time: '' };
			editingSchedule = null;
			fetchSchedules();
		} catch (err) {
			errorMessages = err.message;
		}
	// データベースの更新後に予定一覧を再取得
  		fetchSchedules();
	}

	async function deleteSchedule(id) {
	  // API呼び出しによる削除の処理
	  errorMessages = '';
	  try {
		const res = await fetch(`/api/schedules/${id}`, {
		  method: 'DELETE',
		});
		if (!res.ok) throw new Error('予定の削除に失敗しました');
		fetchSchedules();
	  } catch (err) {
		errorMessages = err.message;
	  }
	}
  
	function editSchedule(schedule) {
	  newSchedule = { ...schedule };
	  editingSchedule = schedule;
	}
  
	onMount(fetchSchedules);
</script>
  
  <main class="p-4 max-w-xl mx-auto">
	<h1 class="text-2xl font-bold mb-4">予定管理アプリ</h1>
  
	<form on:submit|preventDefault={addOrUpdateSchedule} class="mb-4">
	  <div class="mb-2">
		<label for="title" class="block text-sm font-bold mb-1">タイトル</label>
		<input id="title" bind:value={newSchedule.title} class="w-full px-2 py-1 border rounded" />
	  </div>
	<div class="mb-2">
		<label for="description" class="block text-sm font-bold mb-1">説明</label>
		<input id="description" bind:value={newSchedule.description} class="w-full px-2 py-1 border rounded" />
	</div>
	  <div class="mb-2">
		<label for="date" class="block text-sm font-bold mb-1">日付</label>
		<input id="date" type="date" bind:value={newSchedule.date} class="w-full px-2 py-1 border rounded" />
	  </div>
	  <div class="mb-2">
		<label for="time" class="block text-sm font-bold mb-1">時間</label>
		<input id="time" type="time" bind:value={newSchedule.time} class="w-full px-2 py-1 border rounded" />
	  </div>
	  <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">
		{editingSchedule ? '更新' : '追加'}
	  </button>
	  {#if editingSchedule}
		<button type="button" on:click={() => { newSchedule = { title: '', description: '', date: '', time: '' }; editingSchedule = null; }} class="ml-2 px-4 py-2 bg-gray-500 text-white rounded">キャンセル</button>
	  {/if}
	</form>
  
	<h2 class="text-xl font-bold mb-2">予定一覧</h2>
	<ul>
	  {#each schedules as schedule}
		<li class="mb-2 p-2 border rounded">
		  <h2 class="text-xl font-bold">{schedule.title}</h2>
		  <p>{schedule.description}</p>
		  <p>{schedule.date} {schedule.time}</p>
		  <button on:click={() => editSchedule(schedule)} class="mt-2 px-4 py-2 bg-green-500 text-white rounded">編集</button>
		  <button on:click={() => deleteSchedule(schedule.id)} class="mt-2 px-4 py-2 bg-red-500 text-white rounded ml-2">削除</button>
		</li>
	  {/each}
	</ul>
  </main>
  