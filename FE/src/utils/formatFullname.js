export function formatFullname(fullname) {
  const nameParts = fullname.split(' ')
  if (nameParts.length >= 3) {
    const firstName = nameParts.slice(0, nameParts.length - 2).join(' ')
    const middleName = nameParts[nameParts.length - 2]
    const lastName = nameParts[nameParts.length - 1]
    return `${firstName} ${middleName.charAt(0)}. ${lastName}`
  } else if (nameParts.length === 2) {
    const [firstName, lastName] = nameParts
    return `${firstName} ${lastName}`
  } else {
    return fullname
  }
}
