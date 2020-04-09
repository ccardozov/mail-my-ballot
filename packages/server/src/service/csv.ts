import { createArrayCsvStringifier } from 'csv-writer'
import { RichStateInfo } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toCSVStingGeneral = <K extends string>(records: Record<K, any>[], keys: K[]): string => {
  const writer = createArrayCsvStringifier({
    header: keys
  })

  return (
    writer.getHeaderString() +
    writer.stringifyRecords(records.map(info => keys.map(k => info[k])))
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeysOfUnion<T> = T extends any ? keyof T: never
type StateKeys = KeysOfUnion<RichStateInfo>

// Must keep this list manually updated
const keys: StateKeys[] = [
  'created',
  'id',
  'ip',
  'userAgent',
  'oid',
  'name',
  'state',
  'city',
  'county',
  'uspsAddress',
  'mailingAddress',
  'birthdate',
  'birthyear',
  'email',
  'phone',
]

export const toCSVSting = (infos: RichStateInfo[]) => {
  // Need to convert firestore TimeStamp to milliseconds since Epoch
  // https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp#todate
  // manipulatable in Google Spreadsheets:
  // https://infoinspired.com/google-docs/spreadsheet/convert-unix-timestamp-to-local-datetime-in-google-sheets/
  const records = infos.map(info => ({
    ...info,
    created: info.created.toMillis()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as Record<StateKeys, any>))
  return toCSVStingGeneral(records, keys)
}
