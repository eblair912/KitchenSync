import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY } from '$env/static/public'

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY)

export async function getData(ListGuid) {
    const { data, error } = await supabase
        .from('tblListItem')
        .select()
        .eq('ListId', ListGuid)
        .eq('isDeleted', 'FALSE');

    if (error) throw new Error(error.message);

    return data;
}

export async function sendData(itemText, isChecked, ListGuid) {

    if (itemText.trim() != '') {
        const { data, error } = await supabase.from('tblListItem').insert([
            {
                ListId: ListGuid,
                ItemText: itemText,
                isChecked: isChecked,
                isDeleted: false
            }
        ]);

        if (error) {
            console.log(error.message);
            throw new Error(error.message);
        }

        return data;
    }

    return [];
}

export async function updateData(itemId, itemText, isChecked) {
    if (itemText.trim() != '') {
        const { error } = await supabase
            .from('tblListItem')
            .update([{ ItemText: itemText, isChecked: isChecked }])
            .eq('ItemId', itemId);

        if (error) {
            console.log(error.message);
            throw new Error(error.message);
        }
    }
}

export async function deleteData(itemId) {
    let dateNow = new Date();

    const { error } = await supabase
        .from('tblListItem')
        .update([{ isDeleted: true, DeletedDate: dateNow }])
        .eq('ItemId', itemId);

    if (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
}

export async function getListLocked(ListGuid) {
    const { data, error } = await supabase
        .from('tblList')
        .select('isLocked')
        .eq('ListId', ListGuid)

    if (error) throw new Error(error.message);

    if(data[0] != null) {
        return data[0].isLocked;
    } else {
        return false;
    }
    
}

export async function newList() {
    const { data, error } = await supabase.from('tblList').insert([
        {
            isLocked: false,
            isDeleted: false
        }
    ]).select();

    if (error) {
        console.log(error.message);
        throw new Error(error.message);
    }

    return data;
}

export async function updateList(ListId, isLocked) {
    const { error } = await supabase
        .from('tblList')
        .update([{ isLocked: isLocked }])
        .eq('ListId', ListId);

    if (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
}

export async function deleteList(ListId) {
    const { error } = await supabase
        .from('tblList')
        .delete()
        .eq('ListId', ListId);

    if (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
}

export async function listExists(ListId) {
    const { data, error } = await supabase
        .from('tblList')
        .select('CreatedDate')
        .eq('ListId', ListId);

    if (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
    return data[0] != null;
}
